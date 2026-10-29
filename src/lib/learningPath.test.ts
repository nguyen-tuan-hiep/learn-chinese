import { expect, it } from 'vitest'
import type { LessonState } from './db'
import { nextPathStep, pathSections, pathSummary, upcoming } from './learningPath'
import { PARTS } from './lessonState'

const mark = (state: Map<string, LessonState>, ids: string[], part: string) => { for (const id of ids) state.set(id, { lessonId: id, done: { [part]: 1 } }) }
const finish = (state: Map<string, LessonState>, id: string) => state.set(id, { lessonId: id, done: Object.fromEntries(PARTS.map((p) => [p.id, 1])) })
const skip = (state: Map<string, LessonState>, id: string) => state.set(id, { lessonId: id, done: {}, skipped: true })
const freshState = () => new Map<string, LessonState>()

it('starts directly with HSK 1', () => {
  expect(nextPathStep(new Map())).toMatchObject({ kind: 'hsk', to: '/lesson/hsk1-01?part=pronunciation' })
})

it('contains only the six textbook stages', () => {
  const sections = pathSections(new Map())
  expect(sections.map((s) => s.id)).toEqual(['hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5', 'hsk6'])
  expect(sections.flatMap((s) => s.items).every((i) => i.kind === 'hsk')).toBe(true)
})

it('starts HSK 1 with pronunciation, then follows the lesson parts', () => {
  const state = freshState()
  expect(nextPathStep(state)).toMatchObject({ kind: 'hsk', lesson: { id: 'hsk1-01' }, part: { id: 'pronunciation' }, to: '/lesson/hsk1-01?part=pronunciation' })
  mark(state, ['hsk1-01'], 'pronunciation')
  expect(nextPathStep(state)).toMatchObject({ part: { id: 'dialogue' } })
  finish(state, 'hsk1-01')
  expect(nextPathStep(state)).toMatchObject({ lesson: { id: 'hsk1-02' }, part: { id: 'pronunciation' } })
  expect(upcoming(state, 3).map((i) => i.id)).toEqual(['hsk1-02', 'hsk1-03', 'hsk1-04'])
})

it('skips without counting as learned, and undoing the skip brings the lesson back', () => {
  const state = freshState()
  skip(state, 'hsk1-01')
  expect(nextPathStep(state)?.id).toBe('hsk1-02')
  expect(pathSummary(state).hsk).toMatchObject({ done: 0, skipped: 1 })
  state.delete('hsk1-01')
  expect(nextPathStep(state)?.id).toBe('hsk1-01')
})

it('counts radicals learned from review cards', () => {
  const summary = pathSummary(new Map(), [{ kind: 'radical', ref: '9' }, { kind: 'recall', ref: 'x' }])
  expect(summary.radical.done).toBe(1)
  expect(summary.radical.total).toBeGreaterThan(100)
})

it('excludes pronunciation and legacy introduction progress from textbook totals', () => {
  const state = new Map<string, LessonState>()
  mark(state, ['foundation-01', 'intro-01', 'start-01'], 'dialogue')
  expect(pathSummary(state)).toMatchObject({ done: 0, total: 146, hsk: { done: 0, total: 146 } })
  expect(nextPathStep(state)?.id).toBe('hsk1-01')
})
