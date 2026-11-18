import { migrateCourseProgress } from './migrateProgress'
import { db, type DayLog, type LessonState, type PlanDay, type PlanWeek, type StoredCard, type StoredReview, type StudyPlan } from './db'
import { useSettings, type SrsSettings } from '@/store/settings'
import { checkParameters } from 'ts-fsrs'
import { createFsrs7Scheduler, fsrs7Definition, FSRS_MODEL_VERSION, FSRS_WEIGHTS } from './fsrsScheduler'
import { recoverPendingRestoreSettings } from './restoreJournal'

export interface StudyBackup {
  format: 'learn-chinese'
  version: 4
  exportedAt: string
  cards: StoredCard[]
  reviews: StoredReview[]
  days: DayLog[]
  lessons: LessonState[]
  studyPlan: StudyPlan | null
  planDays: PlanDay[]
  planWeeks: PlanWeek[]
  /** Null only when an older v1/v2 backup has been parsed. */
  srsSettings: SrsSettings | null
}

export async function exportBackup(): Promise<StudyBackup> {
  const { fsrsModel, fsrsWeights, desiredRetention, newCardsPerDay, maximumInterval, learnAheadMinutes } = useSettings.getState()
  const srsSettings: SrsSettings = { fsrsModel, fsrsWeights: [...fsrsWeights], desiredRetention, newCardsPerDay, maximumInterval, learnAheadMinutes }
  return db.transaction('r', [db.cards, db.reviews, db.days, db.lessonState, db.studyPlans, db.planDays, db.planWeeks], async () => ({
    format: 'learn-chinese' as const, version: 4 as const, exportedAt: new Date().toISOString(),
    cards: await db.cards.toArray(), reviews: await db.reviews.toArray(), days: await db.days.toArray(), lessons: await db.lessonState.toArray(),
    studyPlan: await db.studyPlans.get('main') ?? null, planDays: await db.planDays.toArray(), planWeeks: await db.planWeeks.toArray(),
    srsSettings,
  }))
}

type Row = Record<string, unknown>
const invalid = (): never => { throw new Error('The backup file has the wrong format or contains invalid data.') }
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
function finite(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return invalid()
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
  if (!['recall', 'read', 'listen', 'write', 'sentence', 'translate', 'radical', 'exam', 'flash'].includes(String(value))) return invalid()
  return value as StoredCard['kind']
}
function state(value: unknown): StoredCard['state'] {
  const n = integer(value)
  if (n > 3) return invalid()
  return n as StoredCard['state']
}
function scheduleStatus(value: unknown): StoredCard['scheduleStatus'] {
  if (value !== 'new' && value !== 'learning' && value !== 'review') return invalid()
  return value
}
function list(value: unknown): unknown[] {
  if (!Array.isArray(value) || value.length > 200000) return invalid()
  return value
}
function unique<T>(values: T[], key: (v: T) => string | number): T[] {
  if (new Set(values.map(key)).size !== values.length) return invalid()
  return values
}

function validated<T>(parse: () => T): T {
  try { return parse() } catch { return invalid() }
}

function validateMemoryState(value: Pick<StoredCard, 'state' | 'scheduleStatus' | 'stability' | 'stabilityFast' | 'difficulty' | 'lastReviewAt'>) {
  const expectedStatus = value.state === 0 ? 'new' : value.state === 2 ? 'review' : 'learning'
  if (value.scheduleStatus !== expectedStatus) return invalid()
  if (value.state === 0) {
    if (value.lastReviewAt !== null || value.stability !== 0 || value.stabilityFast !== 0 || value.difficulty !== 0) return invalid()
    return
  }
  if (value.lastReviewAt === null || value.stability <= 0 || value.difficulty <= 0) return invalid()
}

/** Validate before changing any data, and revive dates used by FSRS and IndexedDB. */
export function parseBackup(source: string): StudyBackup {
  if (source.length > 20 * 1024 * 1024) throw new Error('The file is larger than 20 MB.')
  const data = row(JSON.parse(source))
  // Backups made before the project was renamed are still accepted.
  if ((data.format !== 'learn-chinese' && data.format !== 'hanyu-path') || (data.version !== 1 && data.version !== 2 && data.version !== 3 && data.version !== 4)) return invalid()
  const sourceVersion = data.version
  // v1-v3 contain the incompatible FSRS-6 schema. Keep their course progress/settings,
  // but intentionally discard SRS rows just like the local v4 database upgrade.
  const cards = sourceVersion < 4 ? [] : unique(list(data.cards).map((value): StoredCard => {
    const c = row(value)
    const k = kind(c.kind), ref = str(c.ref), id = str(c.id)
    if (id !== `${k}:${ref}` || c.cardId !== id) return invalid()
    const parsed = validated(() => fsrs7Definition.schema.card.parse({ cardId: id, dueAt: date(c.dueAt),
      lastReviewAt: c.lastReviewAt == null ? null : date(c.lastReviewAt), stability: num(c.stability),
      stabilityFast: num(c.stabilityFast), difficulty: num(c.difficulty), scheduledDays: num(c.scheduledDays),
      reps: integer(c.reps), lapses: integer(c.lapses), learningStep: integer(c.learningStep), state: state(c.state),
      scheduleStatus: scheduleStatus(c.scheduleStatus) }))
    validateMemoryState(parsed)
    return { ...parsed, id, cardId: id, kind: k, ref, lessonId: str(c.lessonId), createdAt: date(c.createdAt) }
  }), (c) => c.id)
  const ids = new Set(cards.map((c) => c.id))
  const reviews = sourceVersion < 4 ? [] : list(data.reviews).map((value): StoredReview => {
    const r = row(value), k = kind(r.kind), cardId = str(r.cardId), rating = integer(r.rating)
    if (rating < 1 || rating > 4 || !ids.has(cardId) || !cardId.startsWith(`${k}:`)) return invalid()
    const parsed = validated(() => fsrs7Definition.schema.revlog.parse({ cardId, rating: rating as StoredReview['rating'],
      dueAt: date(r.dueAt), lastReviewAt: r.lastReviewAt == null ? null : date(r.lastReviewAt), reviewTime: date(r.reviewTime),
      state: state(r.state), scheduleStatus: scheduleStatus(r.scheduleStatus), stability: num(r.stability),
      stabilityFast: num(r.stabilityFast), difficulty: num(r.difficulty), scheduledDays: num(r.scheduledDays),
      learningStep: integer(r.learningStep) }))
    validateMemoryState(parsed)
    return { ...parsed, ...(r.id == null ? {} : { id: integer(r.id) }), cardId, kind: k, date: day(r.date) }
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
  const hasStudyPlan = sourceVersion >= 2
  const studyPlan = hasStudyPlan && data.studyPlan != null ? (() => {
    const plan = row(data.studyPlan)
    if (plan.id !== 'main') return invalid()
    return { id: 'main' as const, startDate: day(plan.startDate) }
  })() : null
  const planDays = hasStudyPlan ? unique(list(data.planDays).map((value): PlanDay => {
    const entry = row(value)
    if (entry.shadowDone != null && typeof entry.shadowDone !== 'boolean') return invalid()
    if (entry.speakingDone != null && typeof entry.speakingDone !== 'boolean') return invalid()
    return { date: day(entry.date), shadowDone: entry.shadowDone === true, speakingDone: entry.speakingDone === true }
  }), (entry) => entry.date) : []
  const planWeeks = hasStudyPlan ? unique(list(data.planWeeks).map((value): PlanWeek => {
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
  const srsSettings = sourceVersion >= 3 ? (() => {
    const value = row(data.srsSettings)
    const fsrsModel = sourceVersion >= 4 ? value.fsrsModel : FSRS_MODEL_VERSION
    const fsrsWeights = sourceVersion >= 4 ? list(value.fsrsWeights).map(finite) : [...FSRS_WEIGHTS]
    const desiredRetention = num(value.desiredRetention)
    const newCardsPerDay = integer(value.newCardsPerDay)
    const maximumInterval = integer(value.maximumInterval)
    const learnAheadMinutes = integer(value.learnAheadMinutes)
    if (fsrsModel !== FSRS_MODEL_VERSION || fsrsWeights.length !== 34 || desiredRetention < 0.7 || desiredRetention > 0.99 || newCardsPerDay > 999 || maximumInterval < 1 || maximumInterval > 36500 || learnAheadMinutes > 1440) return invalid()
    validated(() => checkParameters(fsrsWeights))
    validated(() => createFsrs7Scheduler({ desiredRetention, maximumInterval, weights: fsrsWeights }))
    return { fsrsModel, fsrsWeights, desiredRetention, newCardsPerDay, maximumInterval, learnAheadMinutes }
  })() : null
  return { format: 'learn-chinese', version: 4, exportedAt: date(data.exportedAt).toISOString(), cards, reviews, days, lessons, studyPlan, planDays, planWeeks, srsSettings }
}

/** Replace atomically after the user reviews and confirms the backup. */
export async function restoreBackup(backup: StudyBackup) {
  await db.transaction('rw', [db.cards, db.reviews, db.days, db.lessonState, db.studyPlans, db.planDays, db.planWeeks, db.restoreJournal], async () => {
    await db.cards.clear(); await db.reviews.clear(); await db.days.clear(); await db.lessonState.clear()
    await db.studyPlans.clear(); await db.planDays.clear(); await db.planWeeks.clear()
    await db.restoreJournal.clear()
    await db.cards.bulkAdd(backup.cards); await db.reviews.bulkAdd(backup.reviews)
    await db.days.bulkAdd(backup.days); await db.lessonState.bulkAdd(backup.lessons)
    if (backup.studyPlan) await db.studyPlans.add(backup.studyPlan)
    await db.planDays.bulkAdd(backup.planDays); await db.planWeeks.bulkAdd(backup.planWeeks)
    // The nested migration shares this Dexie transaction, so an error rolls back the entire restore.
    await migrateCourseProgress()
    if (backup.srsSettings) await db.restoreJournal.put({
      id: 'srs-settings', settings: { ...backup.srsSettings, fsrsWeights: [...backup.srsSettings.fsrsWeights] },
    })
  })
  await recoverPendingRestoreSettings()
}
