import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'system' | 'light' | 'dark'
export type HskVersion = '2.0' | '3.0'

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
      set: (patch) => set(patch),
    }),
    {
      name: 'hanyu-settings',
      version: 4,
      partialize: ({ dailyMinutes, speechRate, theme, hskVersion, voice, sidebarCollapsed }) => ({ dailyMinutes, speechRate, theme, hskVersion, voice, sidebarCollapsed }),
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
        }
      },
    },
  ),
)
