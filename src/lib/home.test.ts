import { expect, it } from 'vitest'
import { homeAction } from './home'
import type { LessonState } from './db'
import { LESSONS } from '@/data/course'
import { PRONUNCIATION_UNITS } from '@/data/pronunciationLearning'
import { partsFor } from './lessonState'

const state = () => new Map<string, LessonState>()
const finish = (s: Map<string, LessonState>, id: string) => s.set(id, { lessonId: id, done: { dialogue: 1 } })

it('starts a fresh learner at the pronunciation introduction', () => {
  expect(homeAction(state())).toMatchObject({ label: 'Bắt đầu học', to: '/pronunciation?tab=intro' })
})
it('resumes incomplete pronunciation at its correct topic', () => {
  const s = state()
  finish(s, 'foundation-01'); finish(s, 'foundation-02')
  expect(homeAction(s)).toMatchObject({ label: 'Tiếp tục học', to: '/pronunciation?tab=tones' })
})
it('starts HSK 1 when pronunciation is complete', () => {
  const s = state()
  PRONUNCIATION_UNITS.forEach(unit => finish(s, unit.id))
  expect(homeAction(s)).toMatchObject({ label: 'Tiếp tục học', to: '/lesson/hsk1-01?part=pronunciation' })
})
it('prioritizes the next unfinished HSK part over incomplete pronunciation', () => {
  const s = state()
  s.set('hsk1-01', { lessonId: 'hsk1-01', done: { pronunciation: 1 } })
  expect(homeAction(s)).toMatchObject({ label: 'Tiếp tục học', to: '/lesson/hsk1-01?part=dialogue' })
})
it('passes over skipped and finished lessons', () => {
  const s = state()
  s.set('hsk1-01', { lessonId: 'hsk1-01', done: Object.fromEntries(partsFor(LESSONS[0]).map(p => [p.id, 1])) })
  s.set('hsk1-02', { lessonId: 'hsk1-02', done: {}, skipped: true })
  expect(homeAction(s)).toMatchObject({ label: 'Tiếp tục học', to: '/lesson/hsk1-03?part=dialogue' })
})
it('offers the curriculum when every lesson has been completed or skipped', () => {
  const s = state()
  LESSONS.forEach((lesson, i) => s.set(lesson.id, { lessonId: lesson.id, done: i % 2 ? {} : Object.fromEntries(partsFor(lesson).map(p => [p.id, 1])), skipped: !!(i % 2) }))
  expect(homeAction(s)).toMatchObject({ label: 'Tiếp tục học', to: '/course' })
})
it('ignores obsolete progress and does not mutate storage input', () => {
  const s = state(); finish(s, 'start-01'); finish(s, 'removed-lesson')
  const before = [...s.entries()]
  expect(homeAction(s).label).toBe('Bắt đầu học')
  expect([...s.entries()]).toEqual(before)
})
