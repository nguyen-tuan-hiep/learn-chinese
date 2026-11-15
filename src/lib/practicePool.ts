import { WORDS } from '@/data/course'
import type { StoredCard } from './db'

export interface PracticeWord { hanzi: string; pinyin: string; alts: string[]; vi: string }

export const STARTER_SOUNDS: PracticeWord[] = [
  { hanzi: '妈', pinyin: 'mā', alts: [], vi: 'mother · tone 1' },
  { hanzi: '麻', pinyin: 'má', alts: [], vi: 'hemp · tone 2' },
  { hanzi: '马', pinyin: 'mǎ', alts: [], vi: 'horse · tone 3' },
  { hanzi: '骂', pinyin: 'mà', alts: [], vi: 'scold · tone 4' },
]

export function practicePool(cards: Pick<StoredCard, 'kind' | 'ref'>[], expanded = false): PracticeWord[] {
  const learned = new Set(cards.filter((c) => c.kind === 'flash' || c.kind === 'recall').map((c) => c.ref))
  const pool = [...WORDS].filter(([ref]) => expanded || learned.has(ref)).map(([, { word }]) => {
    // The CSV lists two readings as "shéi / shuí".
    const [pinyin, ...alts] = word.pinyin.split(/\s*\/\s*/)
    return { hanzi: word.hanzi, pinyin, alts, vi: word.meaning }
  })
  return pool.length ? pool : STARTER_SOUNDS
}
