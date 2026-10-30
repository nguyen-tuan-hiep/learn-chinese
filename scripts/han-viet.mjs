import { readFileSync } from 'node:fs'

/** Prefer the project's character readings, then the source's single-character entries. */
export function createHanVietReader(dictionary) {
  const notes = readFileSync(new URL('../src/data/charNotes.ts', import.meta.url), 'utf8')
  const rows = notes.match(/const ROWS = `([\s\S]*?)`/)?.[1]
  if (!rows) throw new Error('Cannot read the curated character readings')
  const readings = new Map(rows.split('\n').map((row) => row.split('|').slice(0, 2)))
  for (const entry of dictionary) {
    if (!entry.sv || entry.sv === '—') continue
    for (const char of [entry.s, entry.t]) {
      if (char && [...char].length === 1 && /\p{Script=Han}/u.test(char) && !readings.has(char)) {
        readings.set(char, entry.sv.trim())
      }
    }
  }
  return (word) => {
    if ([...word].some((char) => /\p{Script=Han}/u.test(char) && !readings.has(char))) return '—'
    return [...word].map((char) => {
      if (!/\p{Script=Han}/u.test(char)) return char
      const reading = readings.get(char)
      // Keep alternative readings attached to their own character.
      return reading.includes('/') ? `(${reading.replace(/\s*\/\s*/g, '/')})` : reading
    }).join(' ')
  }
}
