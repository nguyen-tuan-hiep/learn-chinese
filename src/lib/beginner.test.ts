import { describe, expect, it } from 'vitest'
import { BEGINNER_SESSIONS, beginnerProgress } from './beginner'
import type { LessonState } from './db'

it('starts a fresh learner with audio before vocabulary', () => {
  expect(beginnerProgress(new Map()).next?.id).toBe('start-01')
  expect(BEGINNER_SESSIONS).toHaveLength(7)
})
it('resumes the first unfinished session without counting HSK lessons as foundations', () => {
  const state = new Map<string, LessonState>([
    ['start-01', { lessonId: 'start-01', done: { dialogue: 1 } }],
    ['start-03', { lessonId: 'start-03', done: { dialogue: 1 } }],
    ['hsk1-01', { lessonId: 'hsk1-01', done: { vocab: 1 } }],
  ])
  expect(beginnerProgress(state)).toMatchObject({ completed: 2, next: { id: 'start-02' } })
})
describe('completing foundations', () => {
  it('finishes only after all seven sessions', () => {
    const state = new Map(BEGINNER_SESSIONS.map((s) => [s.id, { lessonId: s.id, done: { dialogue: 1 } }]))
    expect(beginnerProgress(state)).toEqual({ completed: 7, total: 7, next: undefined })
  })
})
