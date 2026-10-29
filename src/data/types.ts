/** Pronunciation-chart entry (initials, finals, tones). */
export interface Item {
  id: string
  kind: 'syllable' | 'word'
  /** Pinyin with tone marks, syllables separated by spaces. */
  pinyin: string
  /** Text handed to the zh-CN voice (a character reads more reliably than raw pinyin). */
  say: string
  /** Sound being taught, e.g. "zh" — syllable items only. */
  label?: string
  hanzi?: string
  hanViet?: string
  meaning?: string
  /** Pronunciation tip or memory story, in Vietnamese. */
  note?: string
}

export interface Lesson {
  id: string
  title: string
  subtitle: string
  glyph: string
  items: Item[]
}

export interface Sentence {
  hanzi: string
  /** Standard pinyin, words separated by spaces, with punctuation. */
  pinyin: string
  vi: string
}

export interface Word {
  id: string
  hanzi: string
  /** Pinyin of the word, syllables joined (e.g. "Zhōngguó"). */
  pinyin: string
  /** Other accepted readings, e.g. 谁 shuí. */
  alts?: string[]
  hanViet: string
  meaning: string
  /** Part of speech in Vietnamese: "đại từ", "động từ"… */
  pos: string
  /** Character breakdown, e.g. "女 (nữ, phụ nữ) + 子 (tử, con)". */
  parts?: string
  mnemonic: string
  examples: Sentence[]
}

export type Drill =
  /** Put the tokens in order. */
  | { type: 'order'; vi: string; tokens: string[]; pinyin: string }
  /** Read Vietnamese, type the Chinese in pinyin. */
  | { type: 'translate'; vi: string; hanzi: string; pinyin: string }

export interface GrammarPoint {
  id: string
  title: string
  /** Structure, e.g. "A + 是 + B". */
  pattern: string
  explanation: string
  examples: Sentence[]
  drills: Drill[]
}

export interface DialogueLine extends Sentence {
  speaker: string
}

export interface Dialogue {
  id: string
  title: string
  scene: string
  lines: DialogueLine[]
}

export interface CourseLesson {
  id: string
  level: number
  number: number
  title: string
  titlePinyin: string
  titleVi: string
  words: Word[]
  grammar: GrammarPoint[]
  dialogues: Dialogue[]
}
