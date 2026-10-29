import { describe, expect, it } from 'vitest'
import { LESSONS } from '@/data/course'
import { dialogueSentences, drillSentences, SENTENCES, TRANSLATIONS } from './sentences'

describe('sentence cards', () => {
  it('every lesson yields dialogue and translation cards', () => {
    for (const l of LESSONS.slice(2)) {
      expect(dialogueSentences(l).length, l.id).toBeGreaterThan(0)
      expect(drillSentences(l).length, l.id).toBeGreaterThan(0)
    }
  })
  it('order drills become punctuated sentences', () => {
    const s = drillSentences(LESSONS[2]).find((d) => d.pinyin === 'Nǐ jiào shénme míngzi?')!
    expect(s.hanzi).toBe('你叫什么名字？')
  })
  it('maps are keyed by hanzi', () => {
    for (const [k, v] of [...SENTENCES, ...TRANSLATIONS]) expect(k).toBe(v.hanzi)
    expect(SENTENCES.size).toBeGreaterThan(50)
  })
})
