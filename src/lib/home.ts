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
  if (started) return { label: 'Tiếp tục học', to: current.to, detail: current.detail }
  const pronunciation = pronunciationProgress(state)
  if (pronunciation.completed > 0 && pronunciation.next) return {
    label: 'Tiếp tục học', to: pronunciationUnitLink(pronunciation.next.id), detail: pronunciation.next.title,
  }
  if (!pronunciation.next) return { label: 'Bắt đầu học', to: current.to, detail: current.detail }
  return { label: 'Bắt đầu học', to: '/pronunciation?tab=intro', detail: 'Làm quen tiếng Trung và pinyin, rồi bắt đầu HSK 1.' }
}

/** Vietnamese greeting for the hour of day. */
export function greeting(hour: number) {
  if (hour < 11) return 'Chào buổi sáng'
  if (hour < 14) return 'Chào buổi trưa'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}
