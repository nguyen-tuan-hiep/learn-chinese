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
      // v7 discards persisted FSRS-7's 34 weights after the FSRS-6 downgrade.
      version: 7,
      partialize: ({ dailyMinutes, speechRate, theme, hskVersion, voice, sidebarCollapsed, fsrsModel, fsrsWeights, desiredRetention, newCardsPerDay, maximumInterval, learnAheadMinutes }) => ({
        dailyMinutes, speechRate, theme, hskVersion, voice, sidebarCollapsed,
        fsrsModel, fsrsWeights, desiredRetention, newCardsPerDay, maximumInterval, learnAheadMinutes,
      }),
      migrate: (old) => {
        const previous = (old ?? {}) as Partial<Settings>
        // Keep current preferences; obsolete settings are discarded on upgrade.
        return {
          dailyMinutes: previous.dailyMinutes ?? 15,
          speechRate: previous.speechRate ?? 0.8,
          theme: previous.theme ?? 'system',
          hskVersion: previous.hskVersion === '3.0' ? '3.0' : '2.0',
          voice: previous.voice ?? null,
          sidebarCollapsed: previous.sidebarCollapsed ?? false,
          fsrsModel: FSRS_MODEL_VERSION,
          fsrsWeights: previous.fsrsModel === FSRS_MODEL_VERSION && Array.isArray(previous.fsrsWeights) && [17, 19, 21].includes(previous.fsrsWeights.length) && previous.fsrsWeights.every(Number.isFinite)
            ? [...previous.fsrsWeights]
            : [...FSRS_WEIGHTS],
          desiredRetention: previous.desiredRetention ?? DEFAULT_SRS_SETTINGS.desiredRetention,
          newCardsPerDay: previous.newCardsPerDay ?? DEFAULT_SRS_SETTINGS.newCardsPerDay,
          maximumInterval: previous.maximumInterval ?? DEFAULT_SRS_SETTINGS.maximumInterval,
          learnAheadMinutes: previous.learnAheadMinutes ?? DEFAULT_SRS_SETTINGS.learnAheadMinutes,
        }
      },
    },
  ),
)
