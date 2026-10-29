import Dexie, { type Table } from 'dexie'
import type { Card, ReviewLog } from 'ts-fsrs'

/**
 * recall: meaning → type pinyin · listen: audio → meaning · write: meaning → write the character ·
 * sentence: hear a dialogue line → understand it · translate: Vietnamese sentence → type it in pinyin.
 */
export type CardKind = 'recall' | 'read' | 'listen' | 'write' | 'sentence' | 'translate' | 'radical'

export interface StoredCard extends Card {
  id: string // `${kind}:${ref}`
  kind: CardKind
  /** Word key (`lessonId:wordId`) for recall/listen, the character for write, the hanzi sentence for sentence/translate. */
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

export type LessonPart = 'vocab' | 'grammar' | 'dialogue' | 'writing' | 'radical'

export interface LessonState {
  lessonId: string
  done: Partial<Record<LessonPart, number>> // completion timestamps
  needsPractice?: Partial<Record<LessonPart, boolean>>
}

class HanyuDB extends Dexie {
  cards!: Table<StoredCard, string>
  reviews!: Table<StoredReview, number>
  days!: Table<DayLog, string>
  lessonState!: Table<LessonState, string>

  constructor() {
    super('hanyu-path')
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
  }
}

export const db = new HanyuDB()
