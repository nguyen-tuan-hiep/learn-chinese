/**
 * Version-agnostic course model. Adapts the HSK 2.0 textbook path and the HSK 3.0
 * (FLTRP New HSK Course) word-list course to one shape so pages render both the same way.
 * Pure builders plus one hook; no React components.
 */
import { useMemo } from 'react'
import { useSettings } from '@/store/settings'
import { useStudyData } from './useStudyData'
import type { LessonState } from './db'
import { lessonName } from '@/data/course'
import type { Word } from '@/data/types'
import { NEW_HSK_COURSE, NEW_HSK_BOOK_LESSONS, bookWordProgressId } from '@/data/newHskCourse'
import { pathSections, pathSummary } from './learningPath'
import { completedLessonWords, partsFor } from './lessonState'
import { homeAction } from './home'

export type HskVersion = '2.0' | '3.0'

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
  /** Vietnamese line when available (2.0 only). */
  subtitle?: string
  /** Route that opens the lesson (2.0: its next unfinished part). */
  to: string
  wordCount: number
  /** 0..1. 2.0: parts done / parts; 3.0: words remembered / words. */
  progress: number
  status: 'done' | 'current' | 'todo' | 'skipped'
}

/** A level (book) and its lessons. */
export interface CourseLevel {
  id: string
  level: number
  /** Full title as the source provides it (2.0: "HSK 1 · 2.0"). */
  title: string
  /** Short title, e.g. "HSK 1". */
  shortTitle: string
  lessons: CourseLessonItem[]
  /** Lessons planned but not written yet (always 0 for 3.0). */
  pending: number
  /** Lessons done. */
  done: number
  /** Lessons available (lessons.length). */
  total: number
}

/** A flashcard-ready word in the review deck. */
export interface ReviewWord {
  /** Stable id: 2.0 the word id; 3.0 `hsk3-vocab-{id}`. */
  id: string
  hanzi: string
  pinyin: string
  meaning: string
  pos?: string
  /** e.g. "HSK 1 · Bài 3". */
  lessonLabel: string
  lessonTitle: string
  /** HSK 2.0 only: the full word (examples, mnemonic, breakdown) for the card back. */
  word?: Word
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
  summary: { lessonsDone: number; lessonsTotal: number; wordsLearned: number; wordsTotal: number; radicalsLearned?: number; radicalsTotal?: number }
  /** Words available for review. */
  reviewDeck: ReviewWord[]
  minutesToday: number
  streak: number
}

export type CourseBuild = Omit<CourseModel, 'loaded' | 'minutesToday' | 'streak'>

const shortTitle = (title: string) => title.split('·')[0].trim()

function build2(state: Map<string, LessonState>): CourseBuild {
  const sections = pathSections(state)
  const levels: CourseLevel[] = sections.map((section, index) => {
    const lessons: CourseLessonItem[] = section.items.map(({ lesson, to, status, partsDone }) => {
      const parts = partsFor(lesson).length
      return {
        id: lesson.id, version: '2.0', level: lesson.level, number: lesson.number, title: lesson.title,
        subtitle: lesson.titleVi || undefined, to, wordCount: lesson.words.length,
        progress: parts ? Math.min(1, partsDone / parts) : 0, status,
      }
    })
    const level = Number(section.id.replace(/\D/g, '')) || index + 1
    return {
      id: section.id, level, title: section.title, shortTitle: shortTitle(section.title), lessons, pending: section.pending,
      done: lessons.filter((l) => l.status === 'done').length, total: lessons.length,
    }
  })
  const all = levels.flatMap((l) => l.lessons)
  const current = all.find((l) => l.status === 'current') ?? null
  const summary = pathSummary(state)
  const deck = completedLessonWords(state)
  const action = homeAction(state)
  return {
    version: '2.0', levels, current,
    next: current ? { label: action.label, detail: action.detail, to: action.to } : null,
    summary: {
      lessonsDone: summary.hsk.done, lessonsTotal: summary.hsk.total,
      wordsLearned: deck.length, wordsTotal: all.reduce((n, l) => n + l.wordCount, 0),
      radicalsLearned: summary.radical.done, radicalsTotal: summary.radical.total,
    },
    reviewDeck: deck.map(({ lesson, word }) => ({
      id: word.id, hanzi: word.hanzi, pinyin: word.pinyin, meaning: word.meaning, pos: word.pos || undefined,
      lessonLabel: lessonName(lesson), lessonTitle: lesson.title, word,
    })),
  }
}

function build3(state: Map<string, LessonState>): CourseBuild {
  const remembered = (id: number) => !!state.get(bookWordProgressId(id))?.done.vocab
  let currentFound = false
  const reviewDeck: ReviewWord[] = []
  let wordsTotal = 0
  const levels: CourseLevel[] = NEW_HSK_COURSE.map((book) => {
    const lessons: CourseLessonItem[] = NEW_HSK_BOOK_LESSONS.filter((l) => l.band === book.level).map((lesson) => {
      const known = lesson.words.filter((w) => remembered(w.id))
      for (const w of known) reviewDeck.push({
        id: bookWordProgressId(w.id), hanzi: w.hanzi, pinyin: w.pinyin, meaning: w.meaning, pos: w.pos || undefined,
        lessonLabel: `HSK ${book.level} · Bài ${lesson.number}`, lessonTitle: lesson.title,
      })
      wordsTotal += lesson.words.length
      const studied = !!state.get(lesson.id)?.done.vocab
      const done = studied || (lesson.words.length > 0 && known.length === lesson.words.length)
      const status: CourseLessonItem['status'] = done ? 'done' : !currentFound ? 'current' : 'todo'
      if (status === 'current') currentFound = true
      return {
        id: lesson.id, version: '3.0', level: book.level, number: lesson.number, title: lesson.title,
        to: `/lesson/${lesson.id}`, wordCount: lesson.words.length,
        progress: done ? 1 : lesson.words.length ? known.length / lesson.words.length : 0, status,
      }
    })
    return {
      id: `hsk3-${book.level}`, level: book.level, title: `HSK ${book.level}`, shortTitle: `HSK ${book.level}`,
      lessons, pending: 0, done: lessons.filter((l) => l.status === 'done').length, total: lessons.length,
    }
  })
  const all = levels.flatMap((l) => l.lessons)
  const current = all.find((l) => l.status === 'current') ?? null
  return {
    version: '3.0', levels, current,
    next: current ? { label: 'Tiếp tục học', detail: `HSK ${current.level} · Bài ${current.number} · ${current.title}`, to: current.to } : null,
    summary: { lessonsDone: all.filter((l) => l.status === 'done').length, lessonsTotal: all.length, wordsLearned: reviewDeck.length, wordsTotal },
    reviewDeck,
  }
}

/** Pure builder: course model for a version from persisted lesson state. */
export function buildCourse(version: HskVersion, lessonState: Map<string, LessonState>): CourseBuild {
  return version === '3.0' ? build3(lessonState) : build2(lessonState)
}

/** Course model for the HSK version chosen in settings; memoized on (version, lessonState). */
export function useCourse(): CourseModel {
  const version = useSettings((s) => s.hskVersion)
  const { loaded, lessonState, minutesToday, streak } = useStudyData()
  const built = useMemo(() => buildCourse(version, lessonState), [version, lessonState])
  return { ...built, loaded, minutesToday, streak }
}
