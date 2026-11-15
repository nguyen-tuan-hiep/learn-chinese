import { pronunciationProgress, pronunciationUnitLink } from '@/data/pronunciationLearning'
import type { LessonState } from './db'

export interface HomeAction {
  label: string
  to: string
  detail: string
}

/**
 * Home call to action for a course: the lesson to continue, or, before any lesson is started,
 * the pronunciation introduction. Reads progress only.
 */
export function homeAction(state: Map<string, LessonState>, current: { to: string; detail: string } | null, started: boolean): HomeAction | null {
  if (!current) return null
  if (started) return { label: 'Continue', to: current.to, detail: current.detail }
  const pronunciation = pronunciationProgress(state)
  if (pronunciation.completed > 0 && pronunciation.next) return {
    label: 'Continue', to: pronunciationUnitLink(pronunciation.next.id), detail: pronunciation.next.title,
  }
  if (!pronunciation.next) return { label: 'Start', to: current.to, detail: current.detail }
  return { label: 'Start', to: '/pronunciation?tab=intro', detail: 'Get to know Chinese sounds and pinyin, then start HSK 1.' }
}

/** Greeting for the hour of day. */
export function greeting(hour: number) {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
