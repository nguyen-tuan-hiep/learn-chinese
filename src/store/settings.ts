import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'system' | 'light' | 'dark'

interface Settings {
  /** Study-time goal per day, in minutes. */
  dailyMinutes: number
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
      speechRate: 0.8,
      theme: 'system',
      voice: null,
      set: (patch) => set(patch),
    }),
    {
      name: 'hanyu-settings',
      version: 3,
      partialize: ({ dailyMinutes, speechRate, theme, voice }) => ({ dailyMinutes, speechRate, theme, voice }),
      migrate: (old) => {
        const previous = (old ?? {}) as Partial<Settings>
        // Keep current preferences; obsolete settings are discarded on upgrade.
        return {
          dailyMinutes: previous.dailyMinutes ?? 15,
          speechRate: previous.speechRate ?? 0.8,
          theme: previous.theme ?? 'system',
          voice: previous.voice ?? null,
        }
      },
    },
  ),
)
