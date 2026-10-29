import { describe, expect, it } from 'vitest'
import { LESSONS } from '@/data/course'
import { dialogueSentences, drillSentences, readingSentences, SENTENCES, TRANSLATIONS } from './sentences'

describe('sentence cards', () => {
  it('every lesson yields listening (dialogue or reading) and translation cards', () => {
    for (const l of LESSONS.slice(2)) {
      expect((l.level > 3 ? readingSentences(l) : dialogueSentences(l)).length, l.id).toBeGreaterThan(0)
      expect(drillSentences(l).length, l.id).toBeGreaterThan(0)
    }
  })
  it('order drills become punctuated sentences', () => {
    const s = drillSentences(LESSONS[2]).find((d) => d.pinyin === 'Nǐ jiào shénme míngzi?')!
    expect(s.hanzi).toBe('你叫什么名字？')
  })
  it('a reading gives at most six short sentences for review', () => {
    for (const l of LESSONS.filter((x) => x.readings?.length)) {
      const cards = readingSentences(l)
      expect(cards.length, l.id).toBeLessThanOrEqual(6 * l.readings!.length)
      for (const c of cards) expect(SENTENCES.get(c.hanzi)).toBeTruthy()
    }
  })
  it('maps are keyed by hanzi', () => {
    for (const [k, v] of [...SENTENCES, ...TRANSLATIONS]) expect(k).toBe(v.hanzi)
    expect(SENTENCES.size).toBeGreaterThan(50)
  })
})
