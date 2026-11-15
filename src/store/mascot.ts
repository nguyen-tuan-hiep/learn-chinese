import { create } from 'zustand'

/**
 * The bánh bao mascot's mood, shared by every "live" mascot on screen (top bar, sidebar, tips).
 * Learning events call `cheer`: a right answer makes it happy, a wrong one sad, milestones surprised.
 * The mood falls back to `idle` after a moment. `beat` changes on every call so the same mood twice still replays.
 */
export type Mood = 'idle' | 'happy' | 'sad' | 'wow'

interface MascotState { mood: Mood; beat: number }

export const useMascot = create<MascotState>()(() => ({ mood: 'idle', beat: 0 }))

let timer: ReturnType<typeof setTimeout> | undefined

export function cheer(mood: Exclude<Mood, 'idle'>, ms = 1600) {
  clearTimeout(timer)
  useMascot.setState((s) => ({ mood, beat: s.beat + 1 }))
  timer = setTimeout(() => useMascot.setState({ mood: 'idle' }), ms)
}

/** Shorthand for quiz answers. */
export const cheerAnswer = (right: boolean) => cheer(right ? 'happy' : 'sad')
