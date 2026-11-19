import Dexie, { type Table } from 'dexie'
import type { SrsSettings } from '@/store/settings'

/** Review flashcard of a review-deck word (ref = ReviewWord.id). */
export type CardKind = 'flash'

export type StoredCard = any & {
  id: string // `${kind}:${ref}`
  kind: CardKind
  /** Stable word id in the selected HSK course. */
  ref: string
  lessonId: string
  createdAt: Date
}

export type StoredReview = any & {
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

/** Crash-safe handoff from an IndexedDB restore transaction to the localStorage settings store. */
export interface RestoreJournal {
  id: 'srs-settings'
  settings: SrsSettings
}

export interface LessonState {
  lessonId: string
  done: { vocab?: number; pronunciation?: number } // completion timestamps
  /** The learner chose to skip this lesson or session; it is not counted as learned. */
  skipped?: boolean
}

class HanyuDB extends Dexie {
  cards!: Table<StoredCard, string>
  reviews!: Table<StoredReview, number>
  days!: Table<DayLog, string>
  lessonState!: Table<LessonState, string>
  studyPlans!: Table<StudyPlan, string>
  planDays!: Table<PlanDay, string>
  planWeeks!: Table<PlanWeek, number>
  restoreJournal!: Table<RestoreJournal, string>

  constructor() {
    super('learn-chinese')
    this.version(9)
      .stores({
        days: 'date', cards: 'id, due, kind, lessonId', reviews: '++id, cardId, date', lessonState: 'lessonId',
        studyPlans: 'id', planDays: 'date', planWeeks: 'week', restoreJournal: 'id',
      })
  }
}

export const db = new HanyuDB()
