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

/** One vocabulary entry of a textbook lesson, as in the course CSVs. */
export interface Word {
  /** Progress key, also the review card ref: `hsk2-vocab-1-3-0` (version, level, lesson, index). */
  id: string
  hanzi: string
  /** Pinyin as the CSV gives it, syllables separated by spaces (e.g. "xué shēng"). */
  pinyin: string
  /** Part of speech abbreviation from the CSV ("n.", "v.", "adj."…), empty when the CSV has none. */
  pos: string
  /** English gloss from the CSV. */
  meaning: string
}

/** A textbook lesson: HSK 2.0 (HSK Standard Course 1–6) or HSK 3.0 (New HSK Course 1–4). */
export interface CourseLesson {
  /** 2.0: `hsk1-03`; 3.0: `hsk3-book-1-3`. */
  id: string
  version: '2.0' | '3.0'
  level: number
  number: number
  /** Chinese title. */
  title: string
  titlePinyin?: string
  /** Vietnamese navigation title (2.0). */
  titleVi?: string
  /** Book volume when a level spans two, e.g. "HSK 4B". */
  volume?: string
  words: Word[]
}
