import { describe, expect, it } from 'vitest'
import { LESSONS } from './course'
import { RADICAL_FOR_CHARACTER } from './radicalMap'
import { CORE_RADICALS, RADICALS, RADICAL_LESSONS } from './radicals'

describe('radical curriculum', () => {
  it('covers each Kangxi radical once in 43 short lessons', () => {
    expect(RADICALS).toHaveLength(214)
    expect(new Set(RADICALS.map((radical) => radical.glyph)).size).toBe(214)
    expect(RADICALS.map((radical) => radical.id)).toEqual(Array.from({ length: 214 }, (_, i) => i + 1))
    const taught = RADICAL_LESSONS.flatMap((lesson) => lesson.radicals)
    expect(RADICAL_LESSONS).toHaveLength(43)
    expect(taught.map((radical) => radical.id).sort((a, b) => a - b)).toEqual(RADICALS.map((radical) => radical.id))
    expect(RADICAL_LESSONS.every((lesson) => lesson.radicals.length > 0 && lesson.radicals.length <= 5)).toBe(true)
  })

  it('starts with 40 complete core entries and usable simplified forms', () => {
    expect(CORE_RADICALS).toHaveLength(40)
    expect(RADICAL_LESSONS.slice(0, 8).flatMap((lesson) => lesson.radicals)).toEqual(CORE_RADICALS)
    for (const radical of RADICALS) {
      expect(radical.glyph && radical.meaning && radical.writingGlyph).toBeTruthy()
      expect(radical.strokes).toBeGreaterThan(0)
    }
    expect(RADICALS.find((radical) => radical.glyph === '言')?.writingGlyph).toBe('讠')
    expect(RADICALS.find((radical) => radical.glyph === '水')?.variants).toContain('氵')
  })

  it('orders core radicals so each one appears in the course before the next', () => {
    const first = (id: number) => LESSONS.findIndex((lesson) => lesson.words.some((word) => [...word.hanzi].some((char) => RADICAL_FOR_CHARACTER.get(char) === id)))
    const seen = CORE_RADICALS.map((radical) => first(radical.id)).map((i) => (i < 0 ? Infinity : i))
    expect(seen).toEqual([...seen].sort((a, b) => a - b))
    expect(CORE_RADICALS.slice(0, 5).map((radical) => radical.glyph)).toEqual(expect.arrayContaining(['人', '女']))
  })

  it('can show a dictionary radical for every character taught in HSK words', () => {
    const chars = new Set(LESSONS.flatMap((lesson) => lesson.words.flatMap((word) => [...word.hanzi].filter((char) => /\p{Script=Han}/u.test(char)))))
    expect([...chars].filter((char) => !RADICAL_FOR_CHARACTER.has(char))).toEqual([])
  })
})
