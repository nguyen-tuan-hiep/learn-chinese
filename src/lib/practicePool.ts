import { WORDS } from '@/data/course'
import type { StoredCard } from './db'

export interface PracticeWord { hanzi: string; pinyin: string; alts: string[]; vi: string }

export const STARTER_SOUNDS: PracticeWord[] = [
  { hanzi: '妈', pinyin: 'mā', alts: [], vi: 'mẹ · thanh 1' },
  { hanzi: '麻', pinyin: 'má', alts: [], vi: 'cây gai · thanh 2' },
  { hanzi: '马', pinyin: 'mǎ', alts: [], vi: 'ngựa · thanh 3' },
  { hanzi: '骂', pinyin: 'mà', alts: [], vi: 'mắng · thanh 4' },
]

export function practicePool(cards: Pick<StoredCard, 'kind' | 'ref'>[], expanded = false): PracticeWord[] {
  const learned = new Set(cards.filter((c) => c.kind === 'recall').map((c) => c.ref))
  const pool = [...WORDS].filter(([ref]) => expanded || learned.has(ref)).map(([, { word }]) => ({ hanzi: word.hanzi, pinyin: word.pinyin, alts: word.alts ?? [], vi: word.meaning }))
  return pool.length ? pool : STARTER_SOUNDS
}
