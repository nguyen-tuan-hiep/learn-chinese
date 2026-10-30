import { LESSONS } from '@/data/course'
import type { CourseLesson, Word } from '@/data/types'
import { RADICAL_BY_ID, type Radical } from '@/data/radicals'
import { RADICAL_FOR_CHARACTER } from '@/data/radicalMap'

export interface LessonRadicalStudy {
  radical: Radical
  introducedEarlier: boolean
  words: Word[]
  examples: Word[]
}

const wordIdentity = (word: Word) => `${word.hanzi}:${word.pinyin.toLowerCase().replace(/\s+/g, '')}`

/** Dictionary radicals only: similar-looking or nested components do not count. */
export function wordRadicalIds(word: Word): number[] {
  return [...new Set([...word.hanzi].flatMap((char) => {
    const id = RADICAL_FOR_CHARACTER.get(char)
    return id !== undefined && RADICAL_BY_ID.has(id) ? [id] : []
  }))]
}

const wordsByRadical = new Map<number, Map<string, Word>>()
const firstLesson = new Map<number, number>()
LESSONS.forEach((lesson, index) => {
  for (const word of lesson.words) for (const id of wordRadicalIds(word)) {
    if (!firstLesson.has(id)) firstLesson.set(id, index)
    const words = wordsByRadical.get(id) ?? new Map<string, Word>()
    if (!words.has(wordIdentity(word))) words.set(wordIdentity(word), word)
    wordsByRadical.set(id, words)
  }
})

/** The first textbook lesson containing a character classified under this radical. */
export function firstRadicalLesson(radicalId: number): CourseLesson | undefined {
  const index = firstLesson.get(radicalId)
  return index === undefined ? undefined : LESSONS[index]
}

const cache = new Map<string, LessonRadicalStudy[]>()

/** All radicals in a lesson's vocabulary, with easy examples from the six course levels. */
export function lessonRadicalStudy(lesson: CourseLesson): LessonRadicalStudy[] {
  const cached = cache.get(lesson.id)
  if (cached) return cached
  const currentWords = new Set(lesson.words.map((word) => word.hanzi))
  const grouped = new Map<number, Map<string, Word>>()
  for (const word of lesson.words) for (const id of wordRadicalIds(word)) {
    const words = grouped.get(id) ?? new Map<string, Word>()
    words.set(wordIdentity(word), word)
    grouped.set(id, words)
  }
  const lessonIndex = LESSONS.findIndex((item) => item.id === lesson.id)
  const result = [...grouped].map(([id, words]): LessonRadicalStudy => ({
    radical: RADICAL_BY_ID.get(id)!,
    introducedEarlier: (firstLesson.get(id) ?? lessonIndex) < lessonIndex,
    words: [...words.values()],
    // Source iteration is already ordered by HSK level and textbook lesson.
    examples: [...(wordsByRadical.get(id)?.values() ?? [])]
      .filter((word) => !currentWords.has(word.hanzi)).slice(0, 3),
  })).sort((a, b) => Number(a.introducedEarlier) - Number(b.introducedEarlier)
    || b.words.length - a.words.length || a.radical.id - b.radical.id)
  cache.set(lesson.id, result)
  return result
}
