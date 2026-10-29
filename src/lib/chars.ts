import { LESSONS } from '@/data/course'
import type { CourseLesson, Word } from '@/data/types'
import { splitSyllables } from './pinyin'

export interface CharInfo {
  char: string
  pinyin: string
  /** Words (from the course) that contain this character, in course order. */
  words: { word: Word; lesson: CourseLesson }[]
}

const HAN = /\p{Script=Han}/u

const index = new Map<string, CharInfo>()
for (const lesson of LESSONS) {
  for (const word of lesson.words) {
    const chars = [...word.hanzi].filter((c) => HAN.test(c))
    const syls = splitSyllables(word.pinyin.replace(/\s+/g, ''))
    chars.forEach((char, i) => {
      const info = index.get(char) ?? { char, pinyin: syls[i] ?? '', words: [] }
      info.words.push({ word, lesson })
      // Prefer the reading from a single-character word (avoids neutral-tone readings like "xie").
      if (chars.length === 1) info.pinyin = word.pinyin
      index.set(char, info)
    })
  }
}

export function charInfo(char: string): CharInfo {
  return index.get(char) ?? { char, pinyin: '', words: [] }
}
