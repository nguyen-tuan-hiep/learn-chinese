/**
 * Build the site's HSK 2.0 course vocabulary from the licensed source files.
 * Usage: node scripts/build-hsk20-curriculum.mjs complete.json dictionary.json
 * Source vocabulary: drkameleon/complete-hsk-vocabulary (MIT, old HSK 2.0 lists).
 * Vietnamese glosses/Han-Viet: CVDICT as packaged by phucbm/xue-hanzi.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const [vocabularyPath, dictionaryPath] = process.argv.slice(2)
if (!vocabularyPath || !dictionaryPath) throw new Error('Pass complete-hsk-vocabulary JSON and CVDICT dictionary JSON paths')
const source = JSON.parse(readFileSync(vocabularyPath, 'utf8'))
const dict = JSON.parse(readFileSync(dictionaryPath, 'utf8'))
const lessonCounts = [15, 15, 20, 20, 36, 40]
const titles = ['HSK Standard Course 1', 'HSK Standard Course 2', 'HSK Standard Course 3', 'HSK Standard Course 4A–4B', 'HSK Standard Course 5A–5B', 'HSK Standard Course 6A–6B']
const byWord = new Map()
for (const entry of dict) {
  if (!entry.s) continue
  const rows = byWord.get(entry.s) ?? []
  rows.push(entry)
  byWord.set(entry.s, rows)
}

const POS = { n: 'danh từ', v: 'động từ', vt: 'động từ', vi: 'động từ', adj: 'tính từ', a: 'tính từ', adv: 'phó từ', d: 'phó từ', pron: 'đại từ', r: 'đại từ', num: 'số từ', m: 'số từ', q: 'lượng từ', prep: 'giới từ', p: 'giới từ', conj: 'liên từ', c: 'liên từ', particle: 'trợ từ', u: 'trợ từ', interj: 'thán từ', e: 'thán từ', idiom: 'thành ngữ', i: 'thành ngữ', measure: 'lượng từ' }
const normalizePinyin = (value) => value.toLowerCase().normalize('NFC').replace(/[\s·]/g, '').replace(/u:/g, 'ü')
const toWord = (entry, level) => {
  const forms = entry.forms ?? []
  const candidates = byWord.get(entry.simplified) ?? []
  const tokens = (text) => text.toLowerCase().split(/[^a-z]+/).filter((token) => token.length > 3)
  const overlap = (left, right) => {
    const rightText = right.join(' ').toLowerCase()
    return tokens(left.join(' ')).reduce((score, token) => score + (rightText.includes(token) ? 1 : 0), 0)
  }
  const form = forms.map((candidate) => {
    const pronunciation = candidate.transcriptions?.pinyin ?? ''
    const matching = candidates.filter((x) => x.p && normalizePinyin(x.p) === normalizePinyin(pronunciation))
    const sourceMeaning = (candidate.meanings ?? []).join(' ').toLowerCase()
    const ordinaryEntryBonus = /surname/.test(sourceMeaning) ? -2 : /variant of/.test(sourceMeaning) ? -1 : 1
    return { candidate, score: Math.max(0, ...matching.map((x) => overlap((candidate.meanings ?? []), x.en ?? []))) + ordinaryEntryBonus }
  }).sort((a, b) => b.score - a.score)[0]?.candidate ?? forms[0] ?? {}
  const pinyin = form.transcriptions?.pinyin ?? ''
  const normalized = normalizePinyin(pinyin)
  const exact = candidates.filter((x) => x.p && normalizePinyin(x.p) === normalized)
  const viEntry = exact.sort((a, b) => {
    const score = (candidate) => overlap((form.meanings ?? []), candidate.en ?? []) + (/surname/i.test((form.meanings ?? []).join(' ')) ? 0 : (/surname|variant of/i.test((candidate.en ?? []).join(' ')) ? -2 : 1))
    return score(b) - score(a)
  })[0] ?? candidates.find((x) => x.vi)
  const meanings = (viEntry?.vi ?? '').split(/\s*\/\s*/).map((x) => x.trim()).filter(Boolean)
  const sourceMeaning = form.meanings?.join('; ') ?? ''
  const likelyWrongHomograph = (/^họ\s*\[/i.test(viEntry?.vi ?? '') && !/surname/i.test(sourceMeaning))
    || (/^biến thể/i.test(viEntry?.vi ?? '') && !/variant/i.test(sourceMeaning))
  const meaning = likelyWrongHomograph ? (sourceMeaning || meanings[0]) : (meanings[0] || sourceMeaning || 'Chưa có nghĩa tiếng Việt trong từ điển nguồn.')
  const codes = entry.pos ?? []
  const pos = codes.map((code) => POS[code]).find(Boolean) ?? 'từ vựng'
  return {
    id: `hsk${level}-w${entry.simplified}`,
    hanzi: entry.simplified,
    pinyin,
    hanViet: viEntry?.sv || '—',
    meaning,
    pos,
    mnemonic: '',
    examples: [],
  }
}

for (let level = 1; level <= 6; level++) {
  const words = source.filter((entry) => (entry.level ?? []).includes(`old-${level}`))
  // High-frequency entries first. This is a project sequencing choice, not the book's lesson order.
  words.sort((a, b) => (a.frequency ?? 1e9) - (b.frequency ?? 1e9) || a.simplified.localeCompare(b.simplified, 'zh'))
  const count = lessonCounts[level - 1]
  const lessons = Array.from({ length: count }, (_, index) => {
    const start = Math.floor(index * words.length / count)
    const end = Math.floor((index + 1) * words.length / count)
    const batch = words.slice(start, end)
    const first = batch[0]?.simplified ?? '词汇'
    return {
      id: `hsk${level}-${String(index + 1).padStart(2, '0')}`,
      level,
      number: index + 1,
      title: `Bài ${index + 1}`,
      titlePinyin: '',
      titleVi: `Từ vựng HSK 2.0 · ${batch.length} mục`,
      topic: 'Từ vựng chuẩn HSK 2.0 · phân bổ của website',
      words: batch.map((entry) => toWord(entry, level)),
      grammar: [],
      dialogues: [],
    }
  })
  const file = resolve(`src/data/curriculum/level${level}.ts`)
  writeFileSync(file, `import type { CurriculumLevel } from './types'\n\nexport const HSK${level}: CurriculumLevel = ${JSON.stringify({ level, textbook: titles[level - 1], plannedLessons: count, lessons }, null, 2)}\n`)
  console.log(`HSK ${level}: ${words.length} vocabulary items -> ${count} lessons`)
}
