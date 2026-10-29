import { LESSONS } from '@/data/course'
import type { CourseLesson } from '@/data/types'
import { db, type LessonPart, type LessonState } from './db'

export const PARTS: { id: LessonPart; label: string; minutes: number }[] = [
  { id: 'vocab', label: 'Từ vựng', minutes: 10 },
  { id: 'grammar', label: 'Ngữ pháp', minutes: 10 },
  { id: 'dialogue', label: 'Hội thoại', minutes: 10 },
  { id: 'writing', label: 'Viết chữ', minutes: 8 },
]

export async function markPart(lessonId: string, part: LessonPart, needsPractice = false) {
  await db.transaction('rw', db.lessonState, async () => {
    const s = (await db.lessonState.get(lessonId)) ?? { lessonId, done: {} }
    await db.lessonState.put({ ...s, done: { ...s.done, [part]: s.done[part] ?? Date.now() }, needsPractice: { ...s.needsPractice, [part]: needsPractice } })
  })
}

/** The first lesson part not done yet, following course order. */
export function nextStep(state: Map<string, LessonState>): { lesson: CourseLesson; part: (typeof PARTS)[number] } | null {
  for (const lesson of LESSONS) {
    const done = state.get(lesson.id)?.done ?? {}
    const part = PARTS.find((p) => !done[p.id])
    if (part) return { lesson, part }
  }
  return null
}

export function partsDone(state: Map<string, LessonState>, lessonId: string) {
  const done = state.get(lessonId)?.done ?? {}
  return PARTS.filter((p) => done[p.id]).length
}
