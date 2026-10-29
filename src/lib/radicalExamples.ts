import { LESSONS } from '@/data/course'
import { RADICAL_FOR_CHARACTER } from '@/data/radicalMap'
import type { Word } from '@/data/types'

const examples = new Map<number, { char: string; word: Word }>()
for (const lesson of LESSONS) for (const word of lesson.words) for (const char of word.hanzi) {
  const id = RADICAL_FOR_CHARACTER.get(char)
  if (id && !examples.has(id)) examples.set(id, { char, word })
}

export function radicalExample(id: number) { return examples.get(id) }

const POSITIONS: Record<string, string> = {
  '亻': 'bên trái', '刂': 'bên phải', '忄': 'bên trái', '扌': 'bên trái', '氵': 'bên trái', '灬': 'phía dưới',
  '犭': 'bên trái', '礻': 'bên trái', '⺮': 'phía trên', '纟': 'bên trái', '艹': 'phía trên', '讠': 'bên trái',
  '贝': 'bên phải hoặc phía dưới', '⻊': 'bên trái', '车': 'bên trái', '辶': 'bao phía dưới và bên trái',
  '钅': 'bên trái', '饣': 'bên trái', '门': 'bao bên ngoài', '马': 'bên trái', '宀': 'phía trên',
  '衤': 'bên trái', '阝': 'bên trái hoặc bên phải, tùy bộ gốc',
}

export function radicalPosition(variants: string[]) {
  const entry = variants.find((variant) => POSITIONS[variant])
  return entry ? POSITIONS[entry] : 'tùy theo chữ'
}
