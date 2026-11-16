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
  meaning?: string
  /** Pronunciation tip or memory story, in English. */
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
  /** Progress key, also the review card ref: its lesson id plus the word's index, e.g. `hsk2-1-03-0`. */
  id: string
  hanzi: string
  /** Pinyin as the CSV gives it, syllables separated by spaces (e.g. "xué shēng"). */
  pinyin: string
  /** Part of speech abbreviation from the CSV ("n.", "v.", "adj."…), empty when the CSV has none. */
  pos: string
  /** English gloss from the CSV. */
  meaning: string
  /** Memory-aid emoji (editorial, src/data/wordEmoji.json), shown next to the word. */
  emoji?: string
}

/** A textbook lesson: HSK 2.0 (HSK Standard Course 1–6) or HSK 3.0 (New HSK Course 1–4). */
export interface CourseLesson {
  /** Course, level and lesson, the same shape for both: `hsk2-1-03`, `hsk3-1-03`. */
  id: string
  version: '2.0' | '3.0'
  level: number
  number: number
  /** Chinese title. */
  title: string
  titlePinyin?: string
  /** English navigation title. */
  titleEn?: string
  /** Book volume when a level spans two, e.g. "HSK 4B". */
  volume?: string
  words: Word[]
}

/** A lesson's title as the course's title list gives it (src/data/hsk2Titles.ts, hsk3Titles.ts). */
export interface LessonTitle {
  hanzi: string
  /** English, an editorial translation for navigation. */
  en: string
  pinyin: string
  /** Book volume when a level spans two, e.g. "HSK 4B". */
  volume?: string
}
