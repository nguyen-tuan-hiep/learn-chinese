import { describe, expect, it } from 'vitest'
import { strokeParts } from '@/data/charComponents'
import { LESSONS } from '@/data/course'
import { CORE_RADICALS } from '@/data/radicals'
import { lessonRadicals, phoneticFamilies, RADICALS_PER_LESSON, taughtIn, TAUGHT_RADICALS } from './lessonRadicals'
import { partsFor } from './lessonState'

describe('radicals taught inside each lesson', () => {
  it('teaches the radicals of lesson 1 characters there, at most five', () => {
    const info = lessonRadicals('hsk1-01')!
    expect(info.taught.length).toBeLessThanOrEqual(RADICALS_PER_LESSON)
    expect(info.taught.map((r) => r.glyph)).toEqual(expect.arrayContaining(['人', '女']))
    expect(info.chars.find((c) => c.char === '你')?.radicals).toEqual(expect.arrayContaining([expect.objectContaining({ status: 'taught', radical: expect.objectContaining({ glyph: '人' }) })]))
  })

  it('sorts every radical of a lesson into taught, known or later, and teaches each radical once', () => {
    const seen = new Set<number>()
    for (const lesson of LESSONS) {
      const info = lessonRadicals(lesson.id)!
      expect(info.taught.length).toBeLessThanOrEqual(RADICALS_PER_LESSON)
      for (const r of info.taught) { expect(seen.has(r.id)).toBe(false); seen.add(r.id); expect(taughtIn(r.id)).toBe(lesson) }
      for (const r of info.known) expect(seen.has(r.id)).toBe(true)
      const listed = new Set([...info.taught, ...info.known, ...info.later].map((r) => r.id))
      for (const c of info.chars) for (const { radical } of c.radicals) expect(listed.has(radical.id)).toBe(true)
    }
    expect(TAUGHT_RADICALS).toHaveLength(seen.size)
  })

  it('teaches every core radical somewhere in HSK 1–3', () => {
    expect(CORE_RADICALS.filter((r) => !taughtIn(r.id)).map((r) => r.glyph)).toEqual([])
  })

  it('maps each stroke to the parts it belongs to', () => {
    expect(strokeParts('妈').map((p) => p[0])).toEqual(['女', '女', '女', '马', '马', '马'])
    expect(strokeParts('您').slice(0, 2)).toEqual([['你', '亻'], ['你', '亻']])
    expect(strokeParts('学')[0]).toEqual(['⺍'])
  })
})

describe('sound-part families', () => {
  it('links new picto-phonetic characters to known ones with the same sound part', () => {
    const families = phoneticFamilies('hsk4-01')
    expect(families.length).toBeGreaterThan(0)
    expect(families.length).toBeLessThanOrEqual(3)
    for (const f of families) {
      expect(f.members.some((m) => m.isNew)).toBe(true)
      expect(f.members.length).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('lesson parts', () => {
  it('replaces the dialogue with a reading from HSK 4 on', () => {
    const ids = (id: string) => partsFor(LESSONS.find((l) => l.id === id)!).map((p) => p.id)
    expect(ids('hsk1-01')).toEqual(['chars', 'vocab', 'grammar', 'dialogue', 'writing'])
    expect(ids('hsk4-01')).toEqual(['chars', 'vocab', 'grammar', 'reading', 'writing'])
  })
})
