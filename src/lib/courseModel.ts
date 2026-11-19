/**
 * Course model shared by HSK 2.0 (HSK Standard Course 1–6) and HSK 3.0 (New HSK Course 1–4).
 * Both are lists of word lessons, so one builder serves both. Pure builders plus one hook; no React components.
 */
import { useMemo } from 'react'
import { useSettings } from '@/store/settings'
import { useStudyData } from './useStudyData'
import type { LessonState } from './db'
import { booksFor, lessonName, type HskVersion } from '@/data/course'
import { homeAction } from './home'

export type { HskVersion }

/** One lesson row/card, identical for both curricula. */
export interface CourseLessonItem {
  id: string
  version: HskVersion
  /** HSK level / band. */
  level: number
  /** Lesson number within the level. */
  number: number
  /** Chinese title. */
  title: string
  /** English title when available. */
  subtitle?: string
  /** Route that opens the lesson. */
  to: string
  wordCount: number
  /** 0..1: words remembered / words (1 once the lesson is marked learned). */
  progress: number
  status: 'done' | 'current' | 'todo' | 'skipped'
}

/** A level (book) and its lessons. */
export interface CourseLevel {
  id: string
  level: number
  /** Full title with the course, e.g. "HSK 1 · 2.0", "HSK 1 · 3.0". */
  title: string
  /** Short title, e.g. "HSK 1". */
  shortTitle: string
  lessons: CourseLessonItem[]
  /** Lessons done. */
  done: number
  /** Lessons available (lessons.length). */
  total: number
  /** Words in the level's lessons, and how many of them are remembered. */
  words: number
  wordsLearned: number
}

/** A flashcard-ready word in the review deck. */
export interface ReviewWord {
  /** Word id, e.g. `hsk2-1-03-0`; also the flashcard ref. */
  id: string
  /** Lesson the word was learned in. */
  lessonId: string
  hanzi: string
  pinyin: string
  meaning: string
  pos?: string
  emoji?: string
  /** e.g. "HSK 1 · Lesson 3". */
  lessonLabel: string
  lessonTitle: string
}

export interface CourseModel {
  version: HskVersion
  /** False until the study database has loaded; data is empty-progress before that. */
  loaded: boolean
  levels: CourseLevel[]
  /** Lesson to continue, or null when everything is done/skipped. */
  current: CourseLessonItem | null
  /** Home call to action. */
  next: { label: string; detail: string; to: string } | null
  summary: { lessonsDone: number; lessonsTotal: number; wordsLearned: number; wordsTotal: number }
  /** Words available for review. */
  reviewDeck: ReviewWord[]
  minutesToday: number
  streak: number
}

export type CourseBuild = Omit<CourseModel, 'loaded' | 'minutesToday' | 'streak'>

function build(version: HskVersion, state: Map<string, LessonState>): CourseBuild {
  const remembered = (id: string) => !!state.get(id)?.done.vocab
  let currentFound = false
  let started = false
  const reviewDeck: ReviewWord[] = []
  let wordsTotal = 0
  const levels: CourseLevel[] = booksFor(version).map((book) => {
    const lessons: CourseLessonItem[] = book.lessons.map((lesson) => {
      const progress = state.get(lesson.id)
      const known = lesson.words.filter((w) => remembered(w.id))
      if (known.length || progress) started = true
      for (const w of known) reviewDeck.push({
        id: w.id, lessonId: lesson.id, hanzi: w.hanzi, pinyin: w.pinyin, meaning: w.meaning, pos: w.pos || undefined, emoji: w.emoji,
        lessonLabel: lessonName(lesson), lessonTitle: lesson.title,
      })
      wordsTotal += lesson.words.length
      const done = lesson.words.length > 0 && known.length === lesson.words.length
      const status: CourseLessonItem['status'] = done ? 'done' : progress?.skipped ? 'skipped' : !currentFound ? 'current' : 'todo'
      if (status === 'current') currentFound = true
      return {
        id: lesson.id, version, level: book.level, number: lesson.number, title: lesson.title, subtitle: lesson.titleEn,
        to: `/lesson/${lesson.id}`, wordCount: lesson.words.length,
        progress: done ? 1 : lesson.words.length ? known.length / lesson.words.length : 0, status,
      }
    })
    return {
      id: `${version === '3.0' ? 'hsk3' : 'hsk2'}-${book.level}`, level: book.level,
      title: `HSK ${book.level} · ${version}`, shortTitle: `HSK ${book.level}`,
      lessons, done: lessons.filter((l) => l.status === 'done').length, total: lessons.length,
      words: book.lessons.reduce((n, l) => n + l.words.length, 0),
      wordsLearned: book.lessons.reduce((n, l) => n + l.words.filter((w) => remembered(w.id)).length, 0),
    }
  })
  const all = levels.flatMap((l) => l.lessons)
  const current = all.find((l) => l.status === 'current') ?? null
  const action = current && homeAction(state, { to: current.to, detail: `HSK ${current.level} · Lesson ${current.number} · ${current.title}` }, started)
  return {
    version, levels, current, next: action,
    summary: {
      lessonsDone: all.filter((l) => l.status === 'done').length, lessonsTotal: all.length, wordsLearned: reviewDeck.length, wordsTotal,
    },
    reviewDeck,
  }
}

/** Pure builder: course model for a version from persisted lesson state. */
export function buildCourse(version: HskVersion, lessonState: Map<string, LessonState>): CourseBuild {
  return build(version, lessonState)
}

/** Course model for the HSK version chosen in settings; memoized on (version, lessonState). */
export function useCourse(): CourseModel {
  const version = useSettings((s) => s.hskVersion)
  const { loaded, lessonState, minutesToday, streak } = useStudyData()
  const built = useMemo(() => buildCourse(version, lessonState), [version, lessonState])
  return { ...built, loaded, minutesToday, streak }
}
