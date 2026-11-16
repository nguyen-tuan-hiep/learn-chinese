import { HSK2_LESSONS } from '@/data/course'
import type { CourseLesson } from '@/data/types'
import { RADICAL_BY_ID } from '@/data/radicals'
import { RADICAL_FOR_CHARACTER } from '@/data/radicalMap'

const firstLesson = new Map<number, number>()
HSK2_LESSONS.forEach((lesson, index) => {
  for (const word of lesson.words) for (const char of word.hanzi) {
    const id = RADICAL_FOR_CHARACTER.get(char)
    if (id !== undefined && RADICAL_BY_ID.has(id) && !firstLesson.has(id)) firstLesson.set(id, index)
  }
})

/** The first textbook lesson containing a character classified under this dictionary radical. */
export function firstRadicalLesson(radicalId: number): CourseLesson | undefined {
  const index = firstLesson.get(radicalId)
  return index === undefined ? undefined : HSK2_LESSONS[index]
}
