import { expect, it } from 'vitest'
import { WORDS } from '@/data/course'
import { practicePool, STARTER_SOUNDS } from './practicePool'

it('gives a fresh learner four foundation sounds instead of the HSK 1–3 course', () => {
  expect(practicePool([])).toEqual(STARTER_SOUNDS)
})
it('only drills introduced vocabulary regardless of other card kinds', () => {
  const [first, second] = [...WORDS.entries()]
  const pool = practicePool([{ kind: 'recall', ref: first[0] }, { kind: 'listen', ref: second[0] }])
  expect(pool.map((w) => w.hanzi)).toEqual([first[1].word.hanzi])
})
it('allows the entire course only after choosing expanded practice', () => {
  expect(practicePool([], true)).toHaveLength(WORDS.size)
})
it('ignores obsolete refs and safely falls back to foundation sounds', () => {
  expect(practicePool([{ kind: 'recall', ref: 'removed:word' }])).toEqual(STARTER_SOUNDS)
})
