import { LEVELS, lessonName } from '@/data/course'
import type { CourseLesson } from '@/data/types'
import type { LessonState, StoredCard } from './db'
import { partsFor, type PartInfo } from './lessonState'
import { TAUGHT_RADICALS } from './lessonRadicals'

export type ItemStatus = 'done' | 'skipped' | 'current' | 'todo'

export interface PathItem {
  id: string; to: string; status: ItemStatus; kind: 'hsk'; lesson: CourseLesson
  part: PartInfo; partsDone: number; needsPractice: boolean
}
export type PathStep = PathItem

export interface PathSection {
  id: string
  title: string
  items: PathItem[]
  /** Lessons of the HSK book not written yet. */
  pending: number
}

function isDone(state: Map<string, LessonState>, item: PathItem) {
  const done = state.get(item.id)?.done ?? {}
  return partsFor(item.lesson).every((part) => done[part.id])
}

function hskItem(state: Map<string, LessonState>, lesson: CourseLesson): PathItem {
  const s = state.get(lesson.id)
  const parts = partsFor(lesson)
  const part = parts.find((p) => !s?.done[p.id]) ?? parts[0]
  return {
    kind: 'hsk', id: lesson.id, lesson, part, to: `/lesson/${lesson.id}?part=${part.id}`, status: 'todo',
    partsDone: parts.filter((p) => s?.done[p.id]).length, needsPractice: Object.values(s?.needsPractice ?? {}).some(Boolean),
  }
}

/**
 * Follow the six textbook levels; pronunciation is available separately.
 */
export function pathSections(state: Map<string, LessonState>): PathSection[] {
  const sections: PathSection[] = [
    ...LEVELS.map((level) => ({ id: `hsk${level.level}`, title: level.title, items: level.lessons.map((lesson) => hskItem(state, lesson)), pending: level.plannedLessons - level.lessons.length })),
  ]
  let current = false
  for (const section of sections) for (const item of section.items) {
    item.status = isDone(state, item) ? 'done' : state.get(item.id)?.skipped ? 'skipped' : !current ? 'current' : 'todo'
    if (item.status === 'current') current = true
  }
  return sections
}

const items = (state: Map<string, LessonState>) => pathSections(state).flatMap((s) => s.items)

/** The single next thing to study, or null when everything is done or skipped. */
export function nextPathStep(state: Map<string, LessonState>): PathItem | null {
  return items(state).find((item) => item.status === 'current') ?? null
}

/** Next textbook lesson to continue. */
export function nextCourseStep(state: Map<string, LessonState>): Extract<PathItem, { kind: 'hsk' }> | null {
  const item = items(state).find((i) => i.kind === 'hsk' && i.status !== 'done' && i.status !== 'skipped')
  return item?.kind === 'hsk' ? item : null
}

/** The next `n` steps still to do, starting with the current one. */
export function upcoming(state: Map<string, LessonState>, n: number) {
  return items(state).filter((item) => item.status === 'current' || item.status === 'todo').slice(0, n)
}

/** Counts for HSK lessons and radicals learned from review cards. */
export function pathSummary(state: Map<string, LessonState>, cards: Pick<StoredCard, 'kind' | 'ref'>[] = []) {
  const all = items(state)
  const count = (kind: PathItem['kind']) => {
    const list = all.filter((i) => i.kind === kind)
    return { done: list.filter((i) => i.status === 'done').length, skipped: list.filter((i) => i.status === 'skipped').length, total: list.length }
  }
  const learned = new Set(cards.filter((c) => c.kind === 'radical').map((c) => Number(c.ref)))
  return {
    hsk: count('hsk'),
    radical: { done: TAUGHT_RADICALS.filter((r) => learned.has(r.id)).length, skipped: 0, total: TAUGHT_RADICALS.length },
    done: all.filter((i) => i.status === 'done').length, total: all.length,
  }
}

/** Short Vietnamese label for a step, including its lesson topic. */
export function stepLabel(item: PathItem) {
  return `${lessonName(item.lesson)} ${item.lesson.title} · ${item.part.label}`
}
