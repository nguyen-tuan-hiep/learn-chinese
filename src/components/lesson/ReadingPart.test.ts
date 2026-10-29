import { expect, it } from 'vitest'
import { segment } from './ReadingPart'

it('splits a reading sentence into the longest course words', () => {
  const parts = segment('我们乘坐动车去上海。')
  expect(parts.filter((p) => p.word).map((p) => p.text)).toEqual(expect.arrayContaining(['我们', '乘坐', '动车']))
  expect(parts.map((p) => p.text).join('')).toBe('我们乘坐动车去上海。')
})
