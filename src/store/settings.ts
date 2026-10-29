import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'system' | 'light' | 'dark'

interface Settings {
  /** Study-time goal per day, in minutes. */
  dailyMinutes: number
  /** Cap on new words introduced per day, so the review load stays sustainable. */
  newWordsPerDay: number
  speechRate: number
  theme: Theme
  /** Preferred zh-CN voice name; null = automatic. */
  voice: string | null
  set: (patch: Partial<Omit<Settings, 'set'>>) => void
}

export const useSettings = create<Settings>()(
  persist(
    (set) => ({
      dailyMinutes: 15,
      newWordsPerDay: 5,
      speechRate: 0.8,
      theme: 'system',
      voice: null,
      set: (patch) => set(patch),
    }),
    { name: 'hanyu-settings', version: 2, migrate: (old) => {
      const previous = old as Partial<Settings>
      return { ...previous, dailyMinutes: previous.dailyMinutes ?? 15, newWordsPerDay: previous.newWordsPerDay ?? 5 } as Settings
    } },
  ),
)
