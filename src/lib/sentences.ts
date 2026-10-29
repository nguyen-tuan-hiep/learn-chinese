import { LESSONS } from '@/data/course'
import type { CourseLesson, Sentence } from '@/data/types'

export interface SentenceEntry extends Sentence {
  lessonId: string
}

const HAN = /\p{Script=Han}/gu
/** One-word lines like 你好！ are already covered by word cards. */
const MIN_CHARS = 4

const PUNCT: Record<string, string> = { '?': '？', '!': '！', '.': '。' }

const hanCount = (t: string) => t.match(HAN)?.length ?? 0

export function dialogueSentences(lesson: CourseLesson): SentenceEntry[] {
  return lesson.dialogues.flatMap((d) => d.lines.filter((l) => hanCount(l.hanzi) >= MIN_CHARS).map((l) => ({ hanzi: l.hanzi, pinyin: l.pinyin, vi: l.vi, lessonId: lesson.id })))
}

/** Reading passages are long; review keeps the short sentences that carry the most new words, up to six. */
const READING_CARDS = 6
export function readingSentences(lesson: CourseLesson): SentenceEntry[] {
  const fresh = lesson.words.map((w) => w.hanzi)
  return (lesson.readings ?? []).flatMap((r) => r.sentences
    .filter((s) => hanCount(s.hanzi) >= MIN_CHARS && hanCount(s.hanzi) <= 30)
    .map((s, i) => ({ s, i, score: fresh.filter((w) => s.hanzi.includes(w)).length }))
    .sort((a, b) => b.score - a.score || a.i - b.i).slice(0, READING_CARDS).sort((a, b) => a.i - b.i)
    .map(({ s }) => ({ hanzi: s.hanzi, pinyin: s.pinyin, vi: s.vi, lessonId: lesson.id })))
}

export function drillSentences(lesson: CourseLesson): (SentenceEntry & { key: string })[] {
  return lesson.grammar.flatMap((g) =>
    g.drills.map((d, i) => ({
      key: `${g.id}-${i}`,
      hanzi: d.type === 'order' ? d.tokens.join('') + (PUNCT[d.pinyin.at(-1)!] ?? '') : d.hanzi,
      pinyin: d.pinyin,
      vi: d.vi,
      lessonId: lesson.id,
    })),
  )
}

/** Card refs are the hanzi text itself, so the same line in two dialogues shares one card. */
export const SENTENCES = new Map<string, SentenceEntry>(LESSONS.flatMap((l) => [...dialogueSentences(l), ...readingSentences(l)].map((s) => [s.hanzi, s] as const)))
export const TRANSLATIONS = new Map<string, SentenceEntry>(LESSONS.flatMap((l) => drillSentences(l).map((s) => [s.hanzi, s] as const)))
