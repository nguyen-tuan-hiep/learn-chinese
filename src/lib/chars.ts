import { LESSONS } from '@/data/course'
import type { CourseLesson, Word } from '@/data/types'
import { componentsOf } from '@/data/charComponents'
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

// Strokes and frames that appear in too many characters to make a useful family.
const TRIVIAL = new Set('一丨丶丿乙亅乚乛二十八人冂冖')
const byPart = new Map<string, string[]>()
for (const char of index.keys()) for (const part of new Set([char, ...componentsOf(char)])) {
  byPart.set(part, [...(byPart.get(part) ?? []), char])
}

/** Course characters sharing a component with `char` (its own parts, or `char` itself as a part), in course order. */
export function charFamily(char: string, limit = 6): { part: string; chars: string[] }[] {
  return [...new Set([char, ...componentsOf(char)])]
    .filter((part) => !TRIVIAL.has(part))
    .map((part) => ({ part, chars: (byPart.get(part) ?? []).filter((c) => c !== char).slice(0, limit) }))
    .filter((group) => group.chars.length > 0)
}

/** Every course character, in the order it is first taught. */
export const COURSE_CHARS = [...index.keys()]
