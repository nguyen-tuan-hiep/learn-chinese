import { LESSONS, lessonName } from '@/data/course'
import { pronunciationProgress, pronunciationUnitLink } from '@/data/pronunciationLearning'
import type { LessonState } from './db'
import { nextCourseStep } from './learningPath'
import { partsFor } from './lessonState'

export interface HomeAction {
  label: string
  to: string
  detail: string
}

/** Resolve the single homepage action without creating or changing any progress. */
export function homeAction(state: Map<string, LessonState>): HomeAction {
  const next = nextCourseStep(state)
  if (!next) return { label: 'Tiếp tục học', to: '/course', detail: 'Bạn đã đi hết lộ trình hiện có. Có thể quay lại bất kỳ bài nào để ôn.' }
  const startedHsk = LESSONS.some(lesson => {
    const progress = state.get(lesson.id)
    return progress?.skipped || partsFor(lesson).some(part => !!progress?.done[part.id])
  })
  if (startedHsk) return { label: 'Tiếp tục học', to: next.to, detail: `${lessonName(next.lesson)} · ${next.lesson.title} · ${next.part.label}` }
  const pronunciation = pronunciationProgress(state)
  if (pronunciation.completed > 0 && pronunciation.next) return {
    label: 'Tiếp tục học', to: pronunciationUnitLink(pronunciation.next.id), detail: pronunciation.next.title,
  }
  if (!pronunciation.next) return { label: 'Tiếp tục học', to: next.to, detail: 'Áp dụng phát âm vào bài đầu tiên của giáo trình.' }
  return { label: 'Bắt đầu học', to: '/pronunciation?tab=intro', detail: 'Làm quen tiếng Trung và pinyin, rồi bắt đầu HSK 1.' }
}
