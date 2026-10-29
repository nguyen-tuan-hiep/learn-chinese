import { describe, expect, it } from 'vitest'
import { CORE_RADICALS, RADICALS } from '@/data/radicals'
import { composeQuestions, radicalFamily } from './radicalFamily'

const radical = (glyph: string) => RADICALS.find((r) => r.glyph === glyph)!
const chars = (glyph: string) => radicalFamily(radical(glyph)).map((m) => m.char)

describe('radical family', () => {
  it('finds course characters through any form of the radical, including nested parts', () => {
    expect(chars('人')).toEqual(expect.arrayContaining(['你', '们', '他', '位', '您']))
    expect(radicalFamily(radical('人')).find((m) => m.char === '您')).toMatchObject({ role: 'nested', via: '你' })
    expect(chars('女')).toEqual(expect.arrayContaining(['好', '妈', '她', '姐']))
  })

  it('tells meaning parts from sound parts and lists the words for each character', () => {
    expect(radicalFamily(radical('口')).find((m) => m.char === '吗')?.role).toBe('semantic')
    expect(radicalFamily(radical('馬')).find((m) => m.char === '妈')?.role).toBe('phonetic')
    const ni = radicalFamily(radical('人')).find((m) => m.char === '你')!
    expect(ni.words.map((w) => w.hanzi)).toEqual(expect.arrayContaining(['你', '你们']))
    for (const m of radicalFamily(radical('人'))) expect(m.words.length).toBeGreaterThan(0)
  })

  it('puts characters from the lesson that needs the radical first', () => {
    expect(chars('人').slice(0, 3)).toEqual(expect.arrayContaining(['你']))
  })

  it('gives every core radical at least two characters to connect', () => {
    expect(CORE_RADICALS.filter((r) => radicalFamily(r).length < 2).map((r) => r.glyph)).toEqual([])
  })

  it('builds stable compose questions whose answer is made of the shown parts', () => {
    const qs = composeQuestions(radical('人'))
    expect(qs).toEqual(composeQuestions(radical('人')))
    expect(qs.length).toBeGreaterThan(0)
    for (const q of qs) {
      expect(q.options).toContain(q.answer)
      expect(new Set(q.options).size).toBe(q.options.length)
      expect(radicalFamily(radical('人')).find((m) => m.char === q.answer)?.parts).toEqual(q.parts)
    }
  })
})
