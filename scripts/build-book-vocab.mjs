/**
 * Convert the user-provided lesson vocabulary CSVs into the JSON the app bundles.
 * Usage: node scripts/build-book-vocab.mjs
 *   HSK2_0_full.csv -> src/data/hsk2Vocabulary.json      (HSK Standard Course 1–6)
 *   HSK3_0_full.csv -> src/data/hsk3Vocabulary.json (New HSK Course 1–4)
 * Output: { "level-lesson": [[hanzi, pinyin, pos, english], ...] } in CSV order.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** Minimal RFC 4180 parser: quoted fields may hold commas, quotes ("") and newlines. */
function parseCsv(text) {
  const rows = []
  let row = [], field = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field); field = ''
      if (row.some((x) => x !== '')) rows.push(row)
      row = []
    } else field += c
  }
  row.push(field)
  if (row.some((x) => x !== '')) rows.push(row)
  return rows
}

function convert(csvFile, jsonFile) {
  const [header, ...rows] = parseCsv(readFileSync(resolve(csvFile), 'utf8').replace(/^﻿/, ''))
  const col = (name) => {
    const index = header.indexOf(name)
    if (index < 0) throw new Error(`${csvFile}: missing column ${name}`)
    return index
  }
  const [level, lesson, hanzi, pinyin, pos, english] = ['Level', 'Lesson', 'Hanzi', 'Pinyin', 'POS', 'English'].map(col)
  const out = {}
  for (const row of rows) {
    const key = `${Number(row[level])}-${Number(row[lesson])}`
    if (!/^\d+-\d+$/.test(key) || !row[hanzi]?.trim()) throw new Error(`${csvFile}: bad row ${row.join(',')}`)
    const clean = (value) => (value ?? '').trim().replace(/\s+/g, ' ')
    ;(out[key] ??= []).push([clean(row[hanzi]), clean(row[pinyin]), clean(row[pos]) === '—' ? '' : clean(row[pos]), clean(row[english])])
  }
  writeFileSync(resolve(jsonFile), JSON.stringify(out))
  const lessons = Object.keys(out).length
  console.log(`${csvFile}: ${rows.length} words in ${lessons} lessons -> ${jsonFile}`)
}

convert('HSK2_0_full.csv', 'src/data/hsk2Vocabulary.json')
convert('HSK3_0_full.csv', 'src/data/hsk3Vocabulary.json')
