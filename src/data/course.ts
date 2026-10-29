import type { CourseLesson, Word } from './types'
import { CURRICULUM_LEVELS } from './curriculum'

export interface Level {
  level: number
  title: string
  /** Number of planned lessons for this level. */
  plannedLessons: number
  /** Words taught in this level's lessons. */
  totalWords: number
  /** HSK exam-list words absent from this textbook's lesson lists. */
  supplementalWords: Word[]
  lessons: CourseLesson[]
}

const level = (n: number, plannedLessons: number, lessons: CourseLesson[], supplementalWords: Word[] = []): Level => ({
  level: n,
  title: levelName(n),
  plannedLessons,
  totalWords: lessons.reduce((sum, l) => sum + l.words.length, 0) + supplementalWords.length,
  supplementalWords,
  lessons,
})

export const levelName = (level: number) => `HSK ${level} · 2.0`
export const lessonName = (lesson: CourseLesson) => `HSK ${lesson.level} · Bài ${lesson.number}`

export const LEVELS: Level[] = CURRICULUM_LEVELS.map(({ level: levelNumber, lessons, supplementalWords }) =>
  level(levelNumber, lessons.length, lessons, supplementalWords),
)

export const LESSONS: CourseLesson[] = LEVELS.flatMap((l) => l.lessons)

/** Word ids already include the HSK level, so moving a word between lessons keeps its SRS identity. */
export const wordKey = (_lesson: CourseLesson, w: Word) => w.id

const supplementaryEntries = LEVELS.flatMap((level) => {
  const finalLesson = level.lessons[level.lessons.length - 1]
  if (!finalLesson) return []
  const lesson = { ...finalLesson, id: `hsk${level.level}-supplement`, title: `Từ bổ sung HSK ${level.level}`, number: finalLesson.number + 1 }
  return level.supplementalWords.map((word) => [wordKey(lesson, word), { word, lesson }] as const)
})

export const WORDS: Map<string, { word: Word; lesson: CourseLesson }> = new Map([
  ...LESSONS.flatMap((lesson) => lesson.words.map((word) => [wordKey(lesson, word), { word, lesson }] as const)),
  ...supplementaryEntries,
])

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
