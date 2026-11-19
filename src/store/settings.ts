import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FSRS_MODEL_VERSION, FSRS_WEIGHTS } from '@/lib/fsrsScheduler'

export type Theme = 'system' | 'light' | 'dark'
export type HskVersion = '2.0' | '3.0'

/** Anki-like FSRS defaults. Existing due dates are not rewritten when these change. */
export interface SrsSettings {
  fsrsModel: typeof FSRS_MODEL_VERSION
  fsrsWeights: number[]
  desiredRetention: number
  newCardsPerDay: number
  maximumInterval: number
  learnAheadMinutes: number
}

export const DEFAULT_SRS_SETTINGS = {
  fsrsModel: FSRS_MODEL_VERSION,
  fsrsWeights: [...FSRS_WEIGHTS],
  desiredRetention: 0.9,
  newCardsPerDay: 20,
  maximumInterval: 3650,
  learnAheadMinutes: 20,
} as const satisfies SrsSettings

interface Settings {
  /** Study-time goal per day, in minutes. */
  dailyMinutes: number
  speechRate: number
  theme: Theme
  hskVersion: HskVersion
  /** Preferred zh-CN voice name; null = automatic. */
  voice: string | null
  /** Sidebar shows icons only (tablet and desktop). */
  sidebarCollapsed: boolean
  /** Scheduler model associated with the persisted parameters. */
  fsrsModel: typeof FSRS_MODEL_VERSION
  /** Exact FSRS-6 parameters used for scheduling; persisted so backups are reproducible. */
  fsrsWeights: number[]
  /** Target probability of recalling a review card when it becomes due. */
  desiredRetention: number
  /** Maximum unseen flashcards introduced on a local calendar day. */
  newCardsPerDay: number
  /** Longest review interval FSRS may schedule, in days. */
  maximumInterval: number
  /** Show same-day learning cards this many minutes before they are due. */
  learnAheadMinutes: number
  set: (patch: Partial<Omit<Settings, 'set'>>) => void
}

export const useSettings = create<Settings>()(
  persist(
    (set) => ({
      dailyMinutes: 15,
      speechRate: 0.8,
      theme: 'system',
      hskVersion: '2.0',
      voice: null,
      sidebarCollapsed: false,
      ...DEFAULT_SRS_SETTINGS,
      set: (patch) => set(patch),
    }),
    {
      name: 'hanyu-settings',
      version: 7,
      partialize: ({ dailyMinutes, speechRate, theme, hskVersion, voice, sidebarCollapsed, fsrsModel, fsrsWeights, desiredRetention, newCardsPerDay, maximumInterval, learnAheadMinutes }) => ({
        dailyMinutes, speechRate, theme, hskVersion, voice, sidebarCollapsed,
        fsrsModel, fsrsWeights, desiredRetention, newCardsPerDay, maximumInterval, learnAheadMinutes,
      }),
    },
  ),
)
