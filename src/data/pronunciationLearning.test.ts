import { expect, it } from 'vitest'
import { PRONUNCIATION_UNITS, pronunciationProgress } from './pronunciationLearning'
import type { LessonState } from '@/lib/db'
import { SOUND_GUIDE, TONE_GUIDE } from '@/data/pronunciationGuide'

it('guides learners through seven foundation sessions with valid activities', () => {
  expect(pronunciationProgress(new Map()).next?.id).toBe('foundation-01')
  expect(PRONUNCIATION_UNITS).toHaveLength(7)
  expect(new Set(PRONUNCIATION_UNITS.map(s => s.id)).size).toBe(7)
  for (const session of PRONUNCIATION_UNITS) for (const q of session.questions) expect(q.choices[q.answer]).toBeTruthy()
  expect(PRONUNCIATION_UNITS.filter(s => s.chart).map(s => s.chart)).toEqual(['tones', 'initials', 'finals'])
})
it('does not count old orientation as completed phonetics or change HSK progress', () => {
  const state = new Map<string, LessonState>([
    ['intro-01', { lessonId: 'intro-01', done: { dialogue: 1 } }],
    ['foundation-01', { lessonId: 'foundation-01', done: { dialogue: 1 } }],
    ['hsk1-01', { lessonId: 'hsk1-01', done: { vocab: 1 } }],
  ])
  expect(pronunciationProgress(state)).toMatchObject({ completed: 1, total: 7, next: { id: 'foundation-02' } })
  expect(state.get('hsk1-01')?.done.vocab).toBe(1)
})
it('finishes only after all foundation sessions', () => {
  const state = new Map(PRONUNCIATION_UNITS.map(s => [s.id, { lessonId: s.id, done: { dialogue: 1 } }]))
  expect(pronunciationProgress(state)).toEqual({ completed: 7, total: 7, next: undefined })
})
it('covers initials and final spellings with Vietnamese cues and Chinese audio samples', () => {
  expect(SOUND_GUIDE.filter(s => s.kind === 'initials')).toHaveLength(21)
  for (const label of ['ü', 'ei', 'ueng', 'iu', 'ui', 'un', 'er']) expect(SOUND_GUIDE.some(s => s.label === label)).toBe(true)
  for (const s of SOUND_GUIDE) {
    expect(s.approximate).toBeTruthy(); expect(s.mouth).toBeTruthy(); expect(s.caution).toBeTruthy()
    expect(s.say).toMatch(/[\u3400-\u9fff]/)
  }
  expect(TONE_GUIDE.map(t => t.tone)).toEqual([1, 2, 3, 4, 5])
})
