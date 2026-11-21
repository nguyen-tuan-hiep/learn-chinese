/**
 * Group every character in the course vocabularies by its radical, for the Radicals page.
 * Usage: node scripts/build-radicals.mjs path/to/makemeahanzi/dictionary.txt
 *   dictionary.txt: https://github.com/skishore/makemeahanzi (LGPL-3.0, see src/data/LICENSES.md)
 * Output: src/data/radicalChars.json
 *   { radical: [[char, pinyin, meaning, otherPart], ...] } in course order (HSK 2.0 then 3.0).
 *   otherPart is the component beside the radical when the character is radical + one part, else "".
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const dictPath = process.argv[2]
if (!dictPath) throw new Error('Pass the path to makemeahanzi dictionary.txt')

const root = resolve(import.meta.dirname, '..')
const dict = new Map()
for (const line of readFileSync(dictPath, 'utf8').split('\n')) {
  if (!line.trim()) continue
  const d = JSON.parse(line)
  dict.set(d.character, d)
}

const isHan = (c) => c >= '一' && c <= '鿿'
// A one-character word's own course meaning beats the dictionary's.
const wordMeaning = new Map()
const order = []
for (const file of ['hsk2Vocabulary.json', 'hsk3Vocabulary.json']) {
  const book = JSON.parse(readFileSync(resolve(root, 'src/data', file), 'utf8'))
  for (const words of Object.values(book)) {
    for (const [hanzi, pinyin, , english] of words) {
      if (hanzi.length === 1 && !wordMeaning.has(hanzi)) wordMeaning.set(hanzi, [pinyin, english])
      for (const c of hanzi) if (isHan(c) && !order.includes(c)) order.push(c)
    }
  }
}

const short = (s) => s.split(/[;,]/)[0].replace(/\(.*?\)/g, '').trim()
const BINARY = new Set('⿰⿱⿴⿵⿶⿷⿸⿹⿺⿻')
const out = {}
let parts = 0
for (const c of order) {
  const d = dict.get(c)
  if (!d?.radical) continue
  const [pinyin, english] = wordMeaning.get(c) ?? [d.pinyin?.[0] ?? '', d.definition ?? '']
  // "⿰氵可" → 可: only when the radical is one side and the other side is a single component.
  const [op, a, b, ...rest] = [...d.decomposition]
  let other = ''
  if (BINARY.has(op) && !rest.length && (a === d.radical || b === d.radical)) other = a === d.radical ? b : a
  if (other === '？') other = ''
  if (other) parts++
  ;(out[d.radical] ??= []).push([c, pinyin, short(english), other])
}

writeFileSync(resolve(root, 'src/data/radicalChars.json'), JSON.stringify(out))
console.log(`${order.length} characters, ${Object.keys(out).length} radicals, ${parts} with a two-part formula`)
