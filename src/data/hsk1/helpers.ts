import type { Sentence, Word } from '../types'

export const s = (hanzi: string, pinyin: string, vi: string): Sentence => ({ hanzi, pinyin, vi })

export function w(
  id: string,
  hanzi: string,
  pinyin: string,
  hanViet: string,
  meaning: string,
  pos: string,
  mnemonic: string,
  examples: Sentence[],
  extra: Partial<Pick<Word, 'parts' | 'alts'>> = {},
): Word {
  return { id, hanzi, pinyin, hanViet, meaning, pos, mnemonic, examples, ...extra }
}
