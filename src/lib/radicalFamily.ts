import { CHAR_COMPONENTS, componentsOf } from '@/data/charComponents'
import { CHAR_NOTES } from '@/data/charNotes'
import { wordKey } from '@/data/course'
import type { Radical } from '@/data/radicals'
import { RADICAL_FOR_CHARACTER } from '@/data/radicalMap'
import { charInfo, COURSE_CHARS } from './chars'
import { taughtIn } from './lessonRadicals'

/** How the radical sits in a character: the meaning part, the sound part, some other part,
 * inside one of the parts (您 ← 你 ← 亻), or the character is the radical itself. */
export type FamilyRole = 'semantic' | 'phonetic' | 'part' | 'nested' | 'self'

export interface FamilyWord { key: string; hanzi: string; pinyin: string; meaning: string }

export interface FamilyMember {
  char: string
  pinyin: string
  /** Short meaning; from the single-character word when the course has one. */
  gloss: string
  hanViet?: string
  story?: string
  role: FamilyRole
  /** Direct parts, e.g. ['亻', '尔']. */
  parts: string[]
  /** The part that contains the radical, for nested members. */
  via?: string
  words: FamilyWord[]
}

const formsOf = (radical: Radical) => new Set([radical.glyph, radical.writingGlyph, ...radical.variants])

/** Lower rank = clearer link to the radical, shown first in the mindmap. */
function roleOf(char: string, radical: Radical, forms: Set<string>): { role: FamilyRole; via?: string; rank: number } | null {
  if (forms.has(char)) return { role: 'self', rank: 0 }
  const parts = componentsOf(char)
  const data = CHAR_COMPONENTS.get(char)
  const direct = parts.find((part) => forms.has(part))
  // A decomposition with an unknown piece ("？") is unreliable; trust it only when the dictionary radical agrees (气 is not 亻).
  const unsure = data?.decomposition.includes('？') && RADICAL_FOR_CHARACTER.get(char) !== radical.id
  if (direct && !unsure) return direct === data?.semantic ? { role: 'semantic', rank: 1 } : direct === data?.phonetic ? { role: 'phonetic', rank: 1 } : { role: 'part', rank: 2 }
  if (RADICAL_FOR_CHARACTER.get(char) === radical.id) return { role: 'part', rank: 3 }
  const via = parts.find((part) => componentsOf(part).some((p) => forms.has(p)))
  return via ? { role: 'nested', via, rank: 4 } : null
}

function member(char: string, role: FamilyRole, via?: string): FamilyMember {
  const info = charInfo(char)
  const single = info.words.find(({ word }) => word.hanzi === char)
  const note = CHAR_NOTES.get(char)
  return {
    char, role, via, pinyin: info.pinyin, hanViet: note?.hanViet, story: note?.story, parts: componentsOf(char),
    gloss: single?.word.meaning ?? (info.words[0] ? `trong ${info.words[0].word.hanzi}: ${info.words[0].word.meaning}` : ''),
    words: info.words.map(({ word, lesson }) => ({ key: wordKey(lesson, word), hanzi: word.hanzi, pinyin: word.pinyin, meaning: word.meaning })),
  }
}

const cache = new Map<number, FamilyMember[]>()

/** Course characters built with this radical: the radical itself, then characters that contain it directly,
 * then nested ones; within each, the lesson that teaches the radical first, then course order. */
export function radicalFamily(radical: Radical): FamilyMember[] {
  const hit = cache.get(radical.id)
  if (hit) return hit
  const forms = formsOf(radical)
  const soon = taughtIn(radical.id)
  const found = COURSE_CHARS.flatMap((char, i) => {
    const hit = roleOf(char, radical, forms)
    return hit ? [{ m: member(char, hit.role, hit.via), rank: hit.rank, i }] : []
  })
  const soonFirst = (m: FamilyMember) => (soon && charInfo(m.char).words.some((w) => w.lesson === soon) ? 0 : 1)
  const tier = (rank: number) => (rank === 0 ? 0 : rank < 4 ? 1 : 2)
  const sorted = found.sort((a, b) => tier(a.rank) - tier(b.rank) || soonFirst(a.m) - soonFirst(b.m) || a.i - b.i).map(({ m }) => m)
  cache.set(radical.id, sorted)
  return sorted
}

export interface ComposeQuestion { parts: [string, string]; answer: string; options: string[] }

/** "亻 + 木 = ?" questions from two-part characters in the family, with distractors from the same family. Deterministic. */
export function composeQuestions(radical: Radical, n = 3): ComposeQuestion[] {
  const forms = formsOf(radical)
  const family = radicalFamily(radical)
  const pool = family.filter((m) => m.role !== 'self' && m.role !== 'nested')
  const twoPart = pool.filter((m) => m.parts.length === 2 && m.parts.some((p) => forms.has(p)))
  const fillers = [...pool, ...family].map((m) => m.char).concat(COURSE_CHARS)
  return twoPart.slice(0, n).map((m, i) => {
    const distractors = [...new Set(fillers)].filter((c) => c !== m.char).slice(i * 2, i * 2 + 2)
    const options = [m.char, ...distractors]
    const turn = m.char.codePointAt(0)! % options.length
    return { parts: [m.parts[0], m.parts[1]], answer: m.char, options: [...options.slice(turn), ...options.slice(0, turn)] }
  })
}
