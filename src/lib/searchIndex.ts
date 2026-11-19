import { HSK3_LESSONS, HSK2_LESSONS, lessonName } from '@/data/course'

export type SearchKind = 'lesson' | 'word'

export interface SearchEntry {
  kind: SearchKind
  /** Big glyph on the left of the row. */
  glyph: string
  title: string
  sub: string
  to: string
  /** Text for the speaker button. */
  say?: string
  /** Chinese text matched as typed. */
  han: string
  /** Accent-free, space-free keys (pinyin, meaning, lesson number…). */
  keys: string[]
  /** Words only: what the word sheet shows. */
  word?: { hanzi: string; pinyin: string; meaning: string }
}

const HAN = /\p{Script=Han}/u

/** Lower case without tone marks, accents, spaces or punctuation: "Xué shēng" → "xuesheng", "Café" → "cafe". */
export function fold(text: string) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9\p{Script=Han}]/gu, '')
}

let cache: SearchEntry[] | null = null

/** Every lesson (2.0 and 3.0) and word, built once on first search. */
export function searchIndex(): SearchEntry[] {
  if (cache) return cache
  const out: SearchEntry[] = []
  for (const lesson of [...HSK2_LESSONS, ...HSK3_LESSONS]) {
    const sub = `${lessonName(lesson)} · ${lesson.version}`
    out.push({
      kind: 'lesson', glyph: [...lesson.title].find((c) => HAN.test(c)) ?? '课', title: lesson.title,
      sub: `${sub}${lesson.titleEn ? ` · ${lesson.titleEn}` : ''}`, to: `/lesson/${lesson.id}`, han: lesson.title,
      keys: [fold(lesson.titlePinyin ?? ''), fold(lesson.titleEn ?? ''), fold(`hsk${lesson.level}lesson${lesson.number}`), fold(`lesson${lesson.number}`)],
    })
    for (const word of lesson.words) out.push({
      kind: 'word', glyph: word.hanzi, title: `${word.pinyin} · ${word.meaning}`, sub,
      to: `/lesson/${lesson.id}`, say: word.hanzi, han: word.hanzi, keys: [fold(word.pinyin), fold(word.meaning)],
      word: { hanzi: word.hanzi, pinyin: word.pinyin, meaning: word.meaning },
    })
  }
  cache = out
  return out
}

/** Best matches per kind: exact hits first, then prefixes, then anywhere; shorter entries win ties. */
export function search(query: string, perKind = 6): Record<SearchKind, SearchEntry[]> {
  const raw = query.trim()
  const q = fold(raw).replace(/(?<=[a-z])[1-5]/g, '')
  const result: Record<SearchKind, SearchEntry[]> = { lesson: [], word: [] }
  if (!q) return result
  const accented = /[^\x00-\x7f]/.test(raw) && !HAN.test(raw) ? raw.toLowerCase() : ''
  const hanQuery = HAN.test(raw) ? [...raw].filter((c) => HAN.test(c)).join('') : ''
  const scored: { entry: SearchEntry; score: number }[] = []
  for (const entry of searchIndex()) {
    let score = 0
    if (hanQuery) {
      if (entry.han === hanQuery || entry.glyph === hanQuery) score = 100
      else if (entry.han.startsWith(hanQuery)) score = 70
      else if (entry.han.includes(hanQuery)) score = 50
    } else {
      for (const key of entry.keys) {
        if (!key) continue
        const s = key === q ? 90 : key.startsWith(q) ? 60 : q.length >= 2 && key.includes(q) ? 30 : 0
        if (s > score) score = s
      }
    }
    // Typed with accents ("café"): entries spelled exactly that way come first.
    if (score && accented && `${entry.title} ${entry.sub}`.toLowerCase().includes(accented)) score += 15
    if (score) scored.push({ entry, score: score - entry.han.length * 0.5 })
  }
  scored.sort((a, b) => b.score - a.score)
  for (const { entry } of scored) {
    const list = result[entry.kind]
    // The same word appears in 2.0 and 3.0; keep one per glyph and course.
    if (list.length < perKind && !list.some((e) => e.glyph === entry.glyph && e.to === entry.to)) list.push(entry)
  }
  return result
}
