import { HSK2_LESSONS } from '@/data/course'
import { RADICAL_FOR_CHARACTER } from '@/data/radicalMap'
import type { Word } from '@/data/types'

const examples = new Map<number, { char: string; word: Word }>()
for (const lesson of HSK2_LESSONS) for (const word of lesson.words) for (const char of word.hanzi) {
  const id = RADICAL_FOR_CHARACTER.get(char)
  if (id && !examples.has(id)) examples.set(id, { char, word })
}

export function radicalExample(id: number) { return examples.get(id) }

const POSITIONS: Record<string, string> = {
  '亻': 'left', '刂': 'right', '忄': 'left', '扌': 'left', '氵': 'left', '灬': 'bottom',
  '犭': 'left', '礻': 'left', '⺮': 'top', '纟': 'left', '艹': 'top', '讠': 'left',
  '贝': 'right or bottom', '⻊': 'left', '车': 'left', '辶': 'wraps the bottom and left',
  '钅': 'left', '饣': 'left', '门': 'encloses the outside', '马': 'left', '宀': 'top',
  '衤': 'left', '阝': 'left or right, depending on the original radical',
}

export function radicalPosition(variants: string[]) {
  const entry = variants.find((variant) => POSITIONS[variant])
  return entry ? POSITIONS[entry] : 'varies by character'
}
