import { db, type DayLog, type LessonState, type PlanDay, type PlanWeek, type StoredCard, type StoredReview, type StudyPlan } from './db'

export interface StudyBackup {
  format: 'hanyu-path'
  version: 2
  exportedAt: string
  cards: StoredCard[]
  reviews: StoredReview[]
  days: DayLog[]
  lessons: LessonState[]
  studyPlan: StudyPlan | null
  planDays: PlanDay[]
  planWeeks: PlanWeek[]
}

export async function exportBackup(): Promise<StudyBackup> {
  return db.transaction('r', [db.cards, db.reviews, db.days, db.lessonState, db.studyPlans, db.planDays, db.planWeeks], async () => ({
    format: 'hanyu-path' as const, version: 2 as const, exportedAt: new Date().toISOString(),
    cards: await db.cards.toArray(), reviews: await db.reviews.toArray(), days: await db.days.toArray(), lessons: await db.lessonState.toArray(),
    studyPlan: await db.studyPlans.get('main') ?? null, planDays: await db.planDays.toArray(), planWeeks: await db.planWeeks.toArray(),
  }))
}

type Row = Record<string, unknown>
const invalid = (): never => { throw new Error('Tệp sao lưu không đúng định dạng hoặc chứa dữ liệu không hợp lệ.') }
function row(value: unknown): Row {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid()
  return value as Row
}
function str(value: unknown): string {
  if (typeof value !== 'string' || !value.length || value.length > 10000) return invalid()
  return value
}
function num(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return invalid()
  return value
}
function integer(value: unknown): number {
  const n = num(value)
  if (!Number.isSafeInteger(n)) return invalid()
  return n
}
function date(value: unknown): Date {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) return invalid()
  return new Date(value)
}
function day(value: unknown): string {
  const s = str(value)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || !Number.isFinite(Date.parse(s)) || new Date(s).toISOString().slice(0, 10) !== s) return invalid()
  return s
}
function kind(value: unknown): StoredCard['kind'] {
  if (!['recall', 'read', 'listen', 'write', 'sentence', 'translate', 'radical', 'exam'].includes(String(value))) return invalid()
  return value as StoredCard['kind']
}
function state(value: unknown): StoredCard['state'] {
  const n = integer(value)
  if (n > 3) return invalid()
  return n
}
function list(value: unknown): unknown[] {
  if (!Array.isArray(value) || value.length > 200000) return invalid()
  return value
}
function unique<T>(values: T[], key: (v: T) => string | number): T[] {
  if (new Set(values.map(key)).size !== values.length) return invalid()
  return values
}

/** Validate before changing any data, and revive dates used by FSRS and IndexedDB. */
export function parseBackup(source: string): StudyBackup {
  if (source.length > 20 * 1024 * 1024) throw new Error('Tệp vượt quá giới hạn 20 MB.')
  const data = row(JSON.parse(source))
  if (data.format !== 'hanyu-path' || (data.version !== 1 && data.version !== 2)) return invalid()
  const cards = unique(list(data.cards).map((value): StoredCard => {
    const c = row(value)
    const k = kind(c.kind), ref = str(c.ref), id = str(c.id)
    if (id !== `${k}:${ref}`) return invalid()
    return { id, kind: k, ref, lessonId: str(c.lessonId), createdAt: date(c.createdAt), due: date(c.due),
      stability: num(c.stability), difficulty: num(c.difficulty), elapsed_days: num(c.elapsed_days), scheduled_days: num(c.scheduled_days),
      reps: integer(c.reps), lapses: integer(c.lapses), learning_steps: integer(c.learning_steps), state: state(c.state),
      ...(c.last_review == null ? {} : { last_review: date(c.last_review) }) }
  }), (c) => c.id)
  const ids = new Set(cards.map((c) => c.id))
  const reviews = list(data.reviews).map((value): StoredReview => {
    const r = row(value), k = kind(r.kind), cardId = str(r.cardId), rating = integer(r.rating)
    if (rating < 1 || rating > 4 || !ids.has(cardId) || !cardId.startsWith(`${k}:`)) return invalid()
    return { cardId, kind: k, rating, date: day(r.date), due: date(r.due), review: date(r.review),
      state: state(r.state), stability: num(r.stability), difficulty: num(r.difficulty), elapsed_days: num(r.elapsed_days),
      last_elapsed_days: num(r.last_elapsed_days), scheduled_days: num(r.scheduled_days), learning_steps: integer(r.learning_steps) }
  })
  const days = unique(list(data.days).map((value): DayLog => { const d = row(value); return { date: day(d.date), seconds: num(d.seconds) } }), (d) => d.date)
  const lessons = unique(list(data.lessons).map((value): LessonState => {
    const l = row(value), done = row(l.done), practice = l.needsPractice == null ? {} : row(l.needsPractice)
    const allowed = ['chars', 'vocab', 'grammar', 'dialogue', 'reading', 'writing', 'radical']
    if (Object.keys(done).some((key) => !allowed.includes(key)) || Object.keys(practice).some((key) => !allowed.includes(key))) return invalid()
    const cleanDone: LessonState['done'] = {}, cleanPractice: NonNullable<LessonState['needsPractice']> = {}
    for (const key of allowed as (keyof LessonState['done'])[]) {
      if (done[key] !== undefined) cleanDone[key] = num(done[key])
      if (practice[key] !== undefined) { if (typeof practice[key] !== 'boolean') return invalid(); cleanPractice[key] = practice[key] }
    }
    if (l.skipped != null && typeof l.skipped !== 'boolean') return invalid()
    return { lessonId: str(l.lessonId), done: cleanDone, needsPractice: cleanPractice, ...(l.skipped ? { skipped: true } : {}) }
  }), (l) => l.lessonId)
  const studyPlan = data.version === 2 && data.studyPlan != null ? (() => {
    const plan = row(data.studyPlan)
    if (plan.id !== 'main') return invalid()
    return { id: 'main' as const, startDate: day(plan.startDate) }
  })() : null
  const planDays = data.version === 2 ? unique(list(data.planDays).map((value): PlanDay => {
    const entry = row(value)
    if (entry.shadowDone != null && typeof entry.shadowDone !== 'boolean') return invalid()
    if (entry.speakingDone != null && typeof entry.speakingDone !== 'boolean') return invalid()
    return { date: day(entry.date), shadowDone: entry.shadowDone === true, speakingDone: entry.speakingDone === true }
  }), (entry) => entry.date) : []
  const planWeeks = data.version === 2 ? unique(list(data.planWeeks).map((value): PlanWeek => {
    const entry = row(value), week = integer(entry.week)
    if (week < 1 || week > 26) return invalid()
    const percent = (value: unknown) => value == null ? undefined : integer(value)
    const listeningPercent = percent(entry.listeningPercent), readingPercent = percent(entry.readingPercent)
    if ((listeningPercent ?? 0) > 100 || (readingPercent ?? 0) > 100) return invalid()
    const speakingMinutes = entry.speakingMinutes == null ? undefined : num(entry.speakingMinutes)
    if (speakingMinutes !== undefined && speakingMinutes > 60) return invalid()
    if (entry.note != null && (typeof entry.note !== 'string' || entry.note.length > 500)) return invalid()
    return { week, listeningPercent, readingPercent, speakingMinutes, note: entry.note as string | undefined }
  }), (entry) => entry.week) : []
  return { format: 'hanyu-path', version: 2, exportedAt: date(data.exportedAt).toISOString(), cards, reviews, days, lessons, studyPlan, planDays, planWeeks }
}

/** Replace atomically after the user reviews and confirms the backup. */
export async function restoreBackup(backup: StudyBackup) {
  await db.transaction('rw', [db.cards, db.reviews, db.days, db.lessonState, db.studyPlans, db.planDays, db.planWeeks], async () => {
    await db.cards.clear(); await db.reviews.clear(); await db.days.clear(); await db.lessonState.clear()
    await db.studyPlans.clear(); await db.planDays.clear(); await db.planWeeks.clear()
    await db.cards.bulkAdd(backup.cards); await db.reviews.bulkAdd(backup.reviews)
    await db.days.bulkAdd(backup.days); await db.lessonState.bulkAdd(backup.lessons)
    if (backup.studyPlan) await db.studyPlans.add(backup.studyPlan)
    await db.planDays.bulkAdd(backup.planDays); await db.planWeeks.bulkAdd(backup.planWeeks)
  })
}
