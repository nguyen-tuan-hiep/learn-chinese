/**
 * Both textbook courses, built from the user-provided CSVs (see scripts/build-book-vocab.mjs):
 * HSK 2.0 = HSK Standard Course 1–6, HSK 3.0 = FLTRP New HSK Course 1–4.
 * Each lesson is a word list; progress is one lessonState row per word (`done.vocab`) plus one per lesson.
 */
import hsk2Vocabulary from './hsk2Vocabulary.json'
import hsk3Vocabulary from './hsk3Vocabulary.json'
import wordEmoji from './wordEmoji.json'
import { HSK2_TITLES } from './hsk2Titles'
import { HSK3_TITLES } from './hsk3Titles'
import type { CourseLesson, LessonTitle, Word } from './types'

export type HskVersion = '2.0' | '3.0'

export interface Book {
  version: HskVersion
  level: number
  /** e.g. "HSK Standard Course 4A–4B". */
  textbook: string
  lessons: CourseLesson[]
}

type Rows = Record<string, [string, string, string, string][]>

const HSK2_TEXTBOOKS = ['HSK Standard Course 1', 'HSK Standard Course 2', 'HSK Standard Course 3', 'HSK Standard Course 4A–4B', 'HSK Standard Course 5A–5B', 'HSK Standard Course 6A–6B']

/** One id shape for both courses: `hsk2-1-03` (course, level, lesson); a word adds its index, `hsk2-1-03-0`. */
const lessonId = (version: HskVersion, level: number, number: number) => `${version === '3.0' ? 'hsk3' : 'hsk2'}-${level}-${String(number).padStart(2, '0')}`

const words = (rows: Rows, id: string, level: number, number: number): Word[] =>
  (rows[`${level}-${number}`] ?? []).map(([hanzi, pinyin, pos, meaning], index) => ({
    id: `${id}-${index}`, hanzi, pinyin, pos, meaning,
    emoji: (wordEmoji as Record<string, string>)[hanzi.trim()],
  }))

/** A course's books: one per level of its title list, one lesson per title, words from its vocabulary rows. */
function books(version: HskVersion, titles: Record<number, LessonTitle[]>, rows: Rows, textbook: (level: number) => string): Book[] {
  return Object.entries(titles).map(([key, list]) => {
    const level = Number(key)
    return {
      version, level, textbook: textbook(level),
      lessons: list.map((title, j): CourseLesson => {
        const number = j + 1
        const id = lessonId(version, level, number)
        return {
          id, version, level, number, title: title.hanzi, titlePinyin: title.pinyin, titleEn: title.en, volume: title.volume,
          words: words(rows, id, level, number),
        }
      }),
    }
  })
}

export const HSK2_BOOKS = books('2.0', HSK2_TITLES, hsk2Vocabulary as unknown as Rows, (level) => HSK2_TEXTBOOKS[level - 1])
export const HSK3_BOOKS = books('3.0', HSK3_TITLES, hsk3Vocabulary as unknown as Rows, (level) => `New HSK Course ${level}`)

export const booksFor = (version: HskVersion) => version === '3.0' ? HSK3_BOOKS : HSK2_BOOKS

/** HSK 2.0 lessons in course order; the radical and character pages follow this course. */
export const HSK2_LESSONS: CourseLesson[] = HSK2_BOOKS.flatMap((book) => book.lessons)
export const HSK3_LESSONS: CourseLesson[] = HSK3_BOOKS.flatMap((book) => book.lessons)
const ALL_LESSONS = [...HSK2_LESSONS, ...HSK3_LESSONS]

export const lessonName = (lesson: Pick<CourseLesson, 'level' | 'number'>) => `HSK ${lesson.level} · Lesson ${lesson.number}`

/** Every word of both courses by id, with its lesson. */
export const WORDS: Map<string, { word: Word; lesson: CourseLesson }> = new Map(
  ALL_LESSONS.flatMap((lesson) => lesson.words.map((word) => [word.id, { word, lesson }] as const)),
)

export function findCourseLesson(id: string): CourseLesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id)
}

/** The lesson after this one in the same course, or undefined at the end. */
export function followingLesson(lesson: CourseLesson): CourseLesson | undefined {
  const list = lesson.version === '3.0' ? HSK3_LESSONS : HSK2_LESSONS
  return list[list.indexOf(lesson) + 1]
}

let legacy: Map<string, string> | null = null
/**
 * Ids from before both courses shared one shape (2.0 lessons `hsk1-03`, 3.0 lessons `hsk3-book-1-3`, words
 * `hsk2-vocab-1-3-0` / `hsk3-vocab-1-3-0`), mapped to today's. Saved progress and old lesson links move with it.
 * None of the old ids can equal a new one: they have a different number of parts or contain `book` / `vocab`.
 */
export function legacyIds(): Map<string, string> {
  if (legacy) return legacy
  legacy = new Map()
  for (const lesson of ALL_LESSONS) {
    const v3 = lesson.version === '3.0'
    legacy.set(v3 ? `hsk3-book-${lesson.level}-${lesson.number}` : `hsk${lesson.level}-${String(lesson.number).padStart(2, '0')}`, lesson.id)
    lesson.words.forEach((word, i) => legacy!.set(`${v3 ? 'hsk3' : 'hsk2'}-vocab-${lesson.level}-${lesson.number}-${i}`, word.id))
  }
  return legacy
}

/** HSK 3.0 word ids before the string ids: 20000 + level·1000 + lesson·100 + index. They overlapped from lesson 10 on. */
export const legacyHsk3WordId = (level: number, number: number, index: number) => 20000 + level * 1000 + number * 100 + index

const CJK = /\p{Script=Han}/u

/** Characters introduced in a lesson for the first time (HSK 2.0 course order). */
export function newCharacters(lesson: CourseLesson): string[] {
  const before = new Set(HSK2_LESSONS.slice(0, HSK2_LESSONS.indexOf(lesson)).flatMap((l) => l.words.flatMap((w) => [...w.hanzi])))
  const out: string[] = []
  for (const w of lesson.words) for (const ch of w.hanzi) if (CJK.test(ch) && !before.has(ch) && !out.includes(ch)) out.push(ch)
  return out
}
