import type { CourseLesson, Word } from './types'
import { HSK1 } from './hsk1'
import { HSK2 } from './hsk2'
import { HSK3 } from './hsk3'

export interface Level {
  level: number
  title: string
  /** Number of lessons in the HSK Standard Course book for this level. */
  plannedLessons: number
  /** Words taught in this level's lessons. */
  totalWords: number
  lessons: CourseLesson[]
}

const level = (n: number, plannedLessons: number, lessons: CourseLesson[]): Level => ({
  level: n,
  title: `HSK ${n}`,
  plannedLessons,
  totalWords: lessons.reduce((sum, l) => sum + l.words.length, 0),
  lessons,
})

export const LEVELS: Level[] = [level(1, 15, HSK1), level(2, 15, HSK2), level(3, 20, HSK3)]

export const LESSONS: CourseLesson[] = LEVELS.flatMap((l) => l.lessons)

/** Word ids are namespaced by lesson so two lessons can't collide. */
export const wordKey = (lesson: CourseLesson, w: Word) => `${lesson.id}:${w.id}`

export const WORDS: Map<string, { word: Word; lesson: CourseLesson }> = new Map(
  LESSONS.flatMap((lesson) => lesson.words.map((word) => [wordKey(lesson, word), { word, lesson }] as const)),
)

export function findCourseLesson(id: string): CourseLesson | undefined {
  return LESSONS.find((l) => l.id === id)
}

const CJK = /\p{Script=Han}/u

/** Characters introduced in a lesson for the first time, in order. */
export function newCharacters(lesson: CourseLesson): string[] {
  const before = new Set(LESSONS.slice(0, LESSONS.indexOf(lesson)).flatMap((l) => l.words.flatMap((w) => [...w.hanzi])))
  const out: string[] = []
  for (const w of lesson.words) for (const ch of w.hanzi) if (CJK.test(ch) && !before.has(ch) && !out.includes(ch)) out.push(ch)
  return out
}
