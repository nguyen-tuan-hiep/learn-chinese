import { describe, expect, it } from 'vitest'
import { marksToNumbers, normalizePinyin, numbersToMarks, splitSyllables, stripTones } from '@/lib/pinyin'
import { LESSONS, newCharacters } from './course'
import { PRON_ITEMS } from './pronunciation'

const NAMES = new Set([...'王明安娜'])
const han = (t: string) => [...t].filter((c) => /\p{Script=Han}/u.test(c))

describe('course data', () => {
  LESSONS.forEach((lesson, i) => {
    const known = new Set([...NAMES, ...LESSONS.slice(0, i + 1).flatMap((l) => l.words.flatMap((w) => [...w.hanzi]))])

    it(`${lesson.id}: words are complete and unique`, () => {
      const ids = lesson.words.map((w) => w.id)
      expect(new Set(ids).size).toBe(ids.length)
      for (const w of lesson.words) {
        expect(w.pinyin && w.hanViet && w.meaning && w.pos && w.mnemonic).toBeTruthy()
        expect(w.examples.length).toBeGreaterThan(0)
        // one syllable per character, so per-character pinyin can be derived
        const syls = splitSyllables(w.pinyin.replace(/\s+/g, ''))
        // erhua (那儿 nàr): 儿 merges into the previous syllable instead of being its own "ér"
        const erhua = w.hanzi.endsWith('儿') && stripTones(syls.at(-1)!) !== 'er' ? 1 : 0
        expect(syls).toHaveLength(han(w.hanzi).length - erhua)
      }
    })

    it(`${lesson.id}: dialogues and drills only use words learned so far`, () => {
      const texts = [
        ...lesson.dialogues.flatMap((d) => d.lines.map((l) => l.hanzi)),
        ...lesson.grammar.flatMap((g) => g.drills.map((d) => (d.type === 'order' ? d.tokens.join('') : d.hanzi))),
      ]
      const unknown = texts.flatMap((t) => [...new Set(han(t).filter((ch) => !known.has(ch)))].map((ch) => `${ch} in "${t}"`))
      expect(unknown.join(" ; ")).toBe("")
    })

    it(`${lesson.id}: has grammar with drills and dialogues`, () => {
      expect(lesson.grammar.length).toBeGreaterThan(0)
      lesson.grammar.forEach((g) => expect(g.drills.length).toBeGreaterThan(0))
      expect(lesson.dialogues.length).toBeGreaterThan(0)
      expect(newCharacters(lesson).length).toBeGreaterThan(0)
    })
  })

  it('no word is taught twice', () => {
    const all = LESSONS.flatMap((l) => l.words.map((w) => w.hanzi))
    expect(all.filter((h, i) => all.indexOf(h) !== i)).toEqual([])
  })

  it('every word can be typed with tone numbers and checked back', () => {
    for (const lesson of LESSONS)
      for (const w of lesson.words) expect(normalizePinyin(numbersToMarks(marksToNumbers(w.pinyin))), w.hanzi).toBe(normalizePinyin(w.pinyin))
  })

  it('pronunciation items are complete', () => {
    for (const i of PRON_ITEMS) expect(i.pinyin && i.say && i.note && i.label).toBeTruthy()
  })
})
