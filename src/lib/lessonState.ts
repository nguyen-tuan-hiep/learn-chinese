import { LESSONS } from '@/data/course'
import type { CourseLesson } from '@/data/types'
import { db, type LessonPart, type LessonState } from './db'

export interface PartInfo { id: LessonPart; label: string; minutes: number }

/** Standard parts available when the lesson has those materials. */
export const PARTS: PartInfo[] = [
  { id: 'pronunciation', label: 'Phát âm', minutes: 10 },
  { id: 'dialogue', label: 'Bài khóa', minutes: 10 },
  { id: 'reading', label: 'Bài khóa · đọc', minutes: 15 },
  { id: 'vocab', label: 'Từ mới', minutes: 10 },
  { id: 'grammar', label: 'Ngữ pháp & ghi chú', minutes: 10 },
  { id: 'confusables', label: 'Phân biệt từ', minutes: 10 },
  { id: 'exercises', label: 'Bài tập', minutes: 10 },
  { id: 'chars', label: 'Cấu tạo chữ · bổ trợ', minutes: 8 },
  { id: 'writing', label: 'Luyện viết · bổ trợ', minutes: 8 },
]

/** From HSK 4 on, a reading passage takes the place of the dialogue. */
const READING_PARTS: PartInfo[] = PARTS.map((p) => (p.id === 'dialogue' ? { id: 'reading', label: 'Đọc hiểu', minutes: 15 } : p))

export const partsFor = (lesson: CourseLesson): PartInfo[] => {
  const sections = lesson.textbookSections ?? []
  const hasSection = (key: string) => sections.some((section) => {
    if (section === key) return true
    if (key === 'text') return /课文|bài khóa|bài đọc/i.test(section)
    if (key === 'newWords') return /生词|từ mới/i.test(section)
    if (key === 'languagePoints') return /语言点|ngữ pháp|điểm ngôn ngữ/i.test(section)
    if (key === 'exercises') return /练习|bài tập|luyện tập/i.test(section)
    if (key === 'confusables') return /近义词|易混|phân biệt từ|cụm từ dễ nhầm/i.test(section)
    if (key === 'pronunciation') return /phát âm|pronunciation/i.test(section)
    return false
  })
  const bookOrder: LessonPart[] = []
  if (hasSection('pronunciation')) bookOrder.push('pronunciation')
  if (hasSection('text')) bookOrder.push(lesson.level >= 4 ? 'reading' : 'dialogue')
  if (hasSection('newWords')) bookOrder.push('vocab')
  if (hasSection('languagePoints')) bookOrder.push('grammar')
  if (hasSection('confusables')) bookOrder.push('confusables')
  if (hasSection('exercises') || hasSection('comprehensiveExercises')) bookOrder.push('exercises')

  // Preserve a usable structure for legacy lessons while textbook material is being migrated.
  const order = bookOrder.length
    ? [...bookOrder, 'chars', 'writing'] as LessonPart[]
    : (lesson.level > 3 ? READING_PARTS : PARTS).filter((p) => p.id !== 'pronunciation' || (lesson.level === 1 && lesson.number <= 2)).map((p) => p.id)

  return order.flatMap((id) => {
    const part = PARTS.find((p) => p.id === id)
    if (!part) return []
    if (id === 'dialogue' && !lesson.dialogues.length) return []
    if (id === 'reading' && !(lesson.readings?.length)) return []
    if (id === 'grammar' && !lesson.grammar.length) return []
    if (id === 'confusables' && !(lesson.confusables?.length)) return []
    if (id === 'exercises' && !(lesson.lessonExercises?.length)) return []
    return [part]
  })
}

export async function markPart(lessonId: string, part: LessonPart, needsPractice = false) {
  await db.transaction('rw', db.lessonState, async () => {
    const s = (await db.lessonState.get(lessonId)) ?? { lessonId, done: {} }
    await db.lessonState.put({ ...s, done: { ...s.done, [part]: s.done[part] ?? Date.now() }, needsPractice: { ...s.needsPractice, [part]: needsPractice } })
  })
}

/** Mark lessons or sessions as skipped (not learned), or undo that. */
export async function setSkipped(lessonIds: string[], skipped: boolean) {
  await db.transaction('rw', db.lessonState, async () => {
    for (const lessonId of lessonIds) {
      const s = (await db.lessonState.get(lessonId)) ?? { lessonId, done: {} }
      await db.lessonState.put({ ...s, skipped })
    }
  })
}

export const isSkipped = (state: Map<string, LessonState>, id: string) => !!state.get(id)?.skipped

/** The first lesson part not done yet, following course order and passing over skipped lessons. */
export function nextStep(state: Map<string, LessonState>): { lesson: CourseLesson; part: PartInfo } | null {
  for (const lesson of LESSONS) {
    if (state.get(lesson.id)?.skipped) continue
    const done = state.get(lesson.id)?.done ?? {}
    const part = partsFor(lesson).find((p) => !done[p.id])
    if (part) return { lesson, part }
  }
  return null
}

export function partsDone(state: Map<string, LessonState>, lesson: CourseLesson) {
  const done = state.get(lesson.id)?.done ?? {}
  return partsFor(lesson).filter((p) => done[p.id]).length
}
