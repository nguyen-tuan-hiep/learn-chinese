import { create } from 'zustand'

/**
 * The notch under the top bar (an island like the iPhone's):
 * at rest it shows the page's progress when the page sets one (lessons), and it briefly grows to report events.
 */
export type NotchIcon = 'audio' | 'plus' | 'check' | 'goal' | 'streak'
export interface NotchEvent { id: number; icon: NotchIcon; text: string; sub?: string; zh?: boolean }
export interface NotchProgress { label: string; done: number; total: number }

interface NotchState {
  event: NotchEvent | null
  progress: NotchProgress | null
  setProgress: (progress: NotchProgress | null) => void
  show: (event: Omit<NotchEvent, 'id'>) => number
  hide: (id: number) => void
}

let seq = 0
const timers = new Map<number, ReturnType<typeof setTimeout>>()

export const useNotch = create<NotchState>()((set, get) => ({
  event: null,
  progress: null,
  setProgress: (progress) => set({ progress }),
  show: (event) => {
    const id = ++seq
    set({ event: { ...event, id } })
    return id
  },
  hide: (id) => { if (get().event?.id === id) set({ event: null }) },
}))

/** Show an event for `ms` (then the notch returns to rest). */
export function notify(event: Omit<NotchEvent, 'id'>, ms = 2400) {
  const id = useNotch.getState().show(event)
  timers.set(id, setTimeout(() => { timers.delete(id); useNotch.getState().hide(id) }, ms))
  return id
}

/** Keep an event up until `release` is called, but at least `minMs`. Used while audio plays. */
export function hold(event: Omit<NotchEvent, 'id'>, minMs = 1200) {
  const id = useNotch.getState().show(event)
  const shown = Date.now()
  // Safety net: some browsers never report the end of speech.
  setTimeout(() => useNotch.getState().hide(id), 15_000)
  return () => {
    const left = Math.max(0, minMs - (Date.now() - shown))
    setTimeout(() => useNotch.getState().hide(id), left)
  }
}
