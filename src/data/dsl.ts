import { stripTones } from '@/lib/pinyin'
import type { CourseLesson, Dialogue, DialogueLine, Drill, GrammarPoint, Sentence, Word } from './types'

/**
 * Compact lesson format (one lesson per template string):
 *
 *   title: 汉字 | pinyin | Vietnamese
 *   [words]
 *   hanzi | pinyin | HÁN VIỆT | meaning | pos | mnemonic | example | example pinyin | example vi [| parts [| alt,readings]]
 *   [grammar] Title | pattern
 *   explanation text (any number of lines, joined)
 *   > example | pinyin | vi
 *   o: vi | tokens separated by spaces | pinyin        (word-order drill)
 *   t: vi | hanzi | pinyin                              (translation drill)
 *   [dialogue] Title | scene
 *   Speaker: hanzi | pinyin | vi
 */
export function lesson(level: number, number: number, source: string): CourseLesson {
  const id = `hsk${level}-${String(number).padStart(2, '0')}`
  const fail = (n: number, msg: string): never => {
    throw new Error(`${id} line ${n}: ${msg}`)
  }
  const cols = (line: string) => line.split('|').map((c) => c.trim())
  const sentence = (n: number, c: string[], at = 0): Sentence => {
    if (c.length < at + 3 || c.slice(at, at + 3).some((x) => !x)) fail(n, 'expected "hanzi | pinyin | vi"')
    return { hanzi: c[at], pinyin: c[at + 1], vi: c[at + 2] }
  }

  let title: CourseLesson['title'] = ''
  let titlePinyin = ''
  let titleVi = ''
  const words: Word[] = []
  const grammar: GrammarPoint[] = []
  const dialogues: Dialogue[] = []
  const seen = new Map<string, number>()
  let mode: 'none' | 'words' | 'grammar' | 'dialogue' = 'none'
  let g: GrammarPoint | null = null
  let d: Dialogue | null = null

  source.split('\n').forEach((raw, i) => {
    const n = i + 1
    const line = raw.trim()
    if (!line) return
    if (line.startsWith('title:')) {
      const c = cols(line.slice(6))
      ;[title, titlePinyin, titleVi] = c
      if (!title || !titlePinyin || !titleVi) fail(n, 'title needs 3 parts')
      return
    }
    if (line === '[words]') return void (mode = 'words')
    if (line.startsWith('[grammar]')) {
      const c = cols(line.slice(9))
      if (c.length < 2) fail(n, 'grammar needs "Title | pattern"')
      g = { id: `g${grammar.length + 1}`, title: c[0], pattern: c[1], explanation: '', examples: [], drills: [] }
      grammar.push(g)
      return void (mode = 'grammar')
    }
    if (line.startsWith('[dialogue]')) {
      const c = cols(line.slice(10))
      if (c.length < 2) fail(n, 'dialogue needs "Title | scene"')
      d = { id: `d${dialogues.length + 1}`, title: c[0], scene: c[1], lines: [] }
      dialogues.push(d)
      return void (mode = 'dialogue')
    }

    if (mode === 'words') {
      const c = cols(line)
      if (c.length < 9 || c.slice(0, 9).some((x) => !x)) fail(n, `word needs 9 fields, got ${c.length}`)
      let base = stripTones(c[1]).toLowerCase().replace(/[^a-zü]/g, '')
      const k = seen.get(base) ?? 0
      seen.set(base, k + 1)
      if (k) base += k + 1
      words.push({
        id: base,
        hanzi: c[0],
        pinyin: c[1],
        hanViet: c[2],
        meaning: c[3],
        pos: c[4],
        mnemonic: c[5],
        examples: [{ hanzi: c[6], pinyin: c[7], vi: c[8] }],
        ...(c[9] ? { parts: c[9] } : {}),
        ...(c[10] ? { alts: c[10].split(',').map((a) => a.trim()) } : {}),
      })
    } else if (mode === 'grammar' && g) {
      if (line.startsWith('> ')) g.examples.push(sentence(n, cols(line.slice(2))))
      else if (line.startsWith('o:')) {
        const c = cols(line.slice(2))
        if (c.length < 3) fail(n, 'order drill needs "vi | tokens | pinyin"')
        g.drills.push({ type: 'order', vi: c[0], tokens: c[1].split(/\s+/), pinyin: c[2] } satisfies Drill)
      } else if (line.startsWith('t:')) {
        const c = cols(line.slice(2))
        if (c.length < 3) fail(n, 'translate drill needs "vi | hanzi | pinyin"')
        g.drills.push({ type: 'translate', vi: c[0], hanzi: c[1], pinyin: c[2] } satisfies Drill)
      } else g.explanation += (g.explanation ? ' ' : '') + line
    } else if (mode === 'dialogue' && d) {
      const m = line.match(/^([^:|]+?):\s+(.+)$/)
      if (!m) return fail(n, 'dialogue line needs "Speaker: hanzi | pinyin | vi"')
      d.lines.push({ speaker: m[1].trim(), ...sentence(n, cols(m[2])) } satisfies DialogueLine)
    } else fail(n, 'line outside any section')
  })

  if (!title) throw new Error(`${id}: missing title`)
  const lastDigit = number
  return { id, level, number: lastDigit, title, titlePinyin, titleVi, words, grammar, dialogues }
}
