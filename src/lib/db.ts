import Dexie, { type Table } from 'dexie'
import type { Card, ReviewLog } from 'ts-fsrs'

/**
 * recall: meaning → type pinyin · listen: audio → meaning · write: meaning → write the character ·
 * sentence: hear a dialogue line → understand it · translate: Vietnamese sentence → type it in pinyin.
 */
export type CardKind = 'recall' | 'read' | 'listen' | 'write' | 'sentence' | 'translate' | 'radical' | 'exam'

export interface StoredCard extends Card {
  id: string // `${kind}:${ref}`
  kind: CardKind
  /** Stable word id for recall/listen, the character for write, the hanzi sentence for sentence/translate. */
  ref: string
  lessonId: string
  createdAt: Date
}

export interface StoredReview extends ReviewLog {
  id?: number
  cardId: string
  kind: CardKind
  date: string // YYYY-MM-DD local
}

export interface DayLog {
  date: string
  seconds: number
}

export interface StudyPlan {
  id: 'main'
  /** Local YYYY-MM-DD, so weeks follow the learner's calendar. */
  startDate: string
}

export interface PlanDay {
  date: string
  shadowDone?: boolean
  speakingDone?: boolean
}

export interface PlanWeek {
  week: number
  speakingMinutes?: number
  listeningPercent?: number
  readingPercent?: number
  note?: string
}

export type LessonPart = 'pronunciation' | 'chars' | 'vocab' | 'grammar' | 'dialogue' | 'reading' | 'confusables' | 'exercises' | 'writing' | 'radical'

export interface LessonState {
  lessonId: string
  done: Partial<Record<LessonPart, number>> // completion timestamps
  needsPractice?: Partial<Record<LessonPart, boolean>>
  /** The learner chose to skip this lesson or session; it is not counted as learned. */
  skipped?: boolean
}

/** The project was renamed from hanyu-path to learn-chinese; progress saved under the old name is moved over once. */
const LEGACY_DB_NAME = 'hanyu-path'

class HanyuDB extends Dexie {
  cards!: Table<StoredCard, string>
  reviews!: Table<StoredReview, number>
  days!: Table<DayLog, string>
  lessonState!: Table<LessonState, string>
  studyPlans!: Table<StudyPlan, string>
  planDays!: Table<PlanDay, string>
  planWeeks!: Table<PlanWeek, number>

  constructor() {
    super('learn-chinese')
    this.version(1).stores({ lessons: 'lessonId', days: 'date', profile: 'id' })
    // v2: real SRS. The XP-era tables are dropped.
    this.version(2)
      .stores({
        lessons: null,
        profile: null,
        days: 'date',
        cards: 'id, due, kind, lessonId',
        reviews: '++id, cardId, date',
        lessonState: 'lessonId',
      })
      .upgrade((tx) => tx.table('days').clear())
    this.version(3).stores({
      days: 'date', cards: 'id, due, kind, lessonId', reviews: '++id, cardId, date', lessonState: 'lessonId',
      studyPlans: 'id', planDays: 'date', planWeeks: 'week',
    })
  }
}

export const db = new HanyuDB()

/**
 * Copy progress from the database of the project's old name into this one, then delete the old one.
 * Runs before the app renders. It only copies into an empty database, and the old one is deleted
 * only after every row arrived, so a failed copy is retried on the next visit and nothing is lost.
 */
export async function migrateLegacyDatabase() {
  try {
    if (!(await Dexie.exists(LEGACY_DB_NAME))) return
    const counts = await Promise.all(db.tables.map((table) => table.count()))
    if (counts.some((n) => n > 0)) return
    const legacy = new Dexie(LEGACY_DB_NAME)
    await legacy.open()
    const rows = new Map<string, unknown[]>()
    try {
      for (const table of legacy.tables) if (db.tables.some((t) => t.name === table.name)) rows.set(table.name, await table.toArray())
    } finally { legacy.close() }
    await db.transaction('rw', db.tables, async () => {
      for (const [name, list] of rows) await db.table(name).bulkPut(list)
    })
    for (const [name, list] of rows) if (await db.table(name).count() !== list.length) return
    await Dexie.delete(LEGACY_DB_NAME)
  } catch (error) {
    console.warn('Could not move progress from the old database', error)
  }
}
