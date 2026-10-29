import { CHAR_COMPONENTS, componentsOf } from '@/data/charComponents'
import { LESSONS, newCharacters } from '@/data/course'
import { RADICAL_BY_GLYPH, RADICAL_BY_ID, type Radical } from '@/data/radicals'
import { RADICAL_FOR_CHARACTER } from '@/data/radicalMap'
import type { CourseLesson } from '@/data/types'

/** At most this many new radicals are taught in one lesson; the rest wait for a later lesson. */
export const RADICALS_PER_LESSON = 5

export type PartStatus = 'taught' | 'known' | 'later'

export interface LessonChar {
  char: string
  /** Radicals visible in the character, each with where the learner stands with it in this lesson. */
  /** `glyph` is the form written in this character, e.g. 亻 for 人. */
  radicals: { radical: Radical; glyph: string; status: PartStatus; semantic: boolean }[]
}

export interface LessonRadicalInfo {
  lesson: CourseLesson
  /** New radicals taught in this lesson, most used first. */
  taught: Radical[]
  /** Radicals in this lesson's characters that an earlier lesson taught. */
  known: Radical[]
  /** Radicals in this lesson's characters left for a later lesson. */
  later: Radical[]
  chars: LessonChar[]
}

const STROKE_RADICALS = new Set([1, 2, 3, 4, 5, 6]) // 一 丨 丶 丿 乙 亅

/**
 * Radicals a learner can see in a character: the character itself when it is one, its direct parts,
 * radicals inside parts that are not radicals themselves (亻 inside 你 inside 您, skipping single strokes)
 * and its dictionary radical.
 * A decomposition with an unknown piece ("？") only counts where the dictionary radical agrees.
 */
export function radicalsIn(char: string): { radical: Radical; glyph: string; semantic: boolean }[] {
  const data = CHAR_COMPONENTS.get(char)
  const unsure = !!data?.decomposition.includes('？')
  const dictionary = RADICAL_FOR_CHARACTER.get(char)
  const found = new Map<number, boolean>()
  const forms = new Map<number, string>()
  const add = (glyph: string, semantic = false) => {
    const radical = RADICAL_BY_GLYPH.get(glyph)
    if (!radical || (unsure && radical.id !== dictionary)) return
    found.set(radical.id, found.get(radical.id) || semantic)
    if (!forms.has(radical.id)) forms.set(radical.id, glyph)
  }
  add(char)
  for (const part of componentsOf(char)) {
    add(part, part === data?.semantic)
    // Look inside a part only when it is not itself a radical (口 is not taught as 冂 + 一).
    if (RADICAL_BY_GLYPH.has(part)) continue
    for (const inner of componentsOf(part)) {
      const radical = RADICAL_BY_GLYPH.get(inner)
      if (radical && !STROKE_RADICALS.has(radical.id)) add(inner)
    }
  }
  if (dictionary !== undefined) found.set(dictionary, found.get(dictionary) ?? false)
  return [...found].map(([id, semantic]) => ({ radical: RADICAL_BY_ID.get(id)!, glyph: forms.get(id) ?? RADICAL_BY_ID.get(id)!.writingGlyph, semantic }))
}

const INFO = new Map<string, LessonRadicalInfo>()
// How many course characters use each radical, to break ties toward radicals worth more later.
const COURSE_USES = new Map<number, number>()
for (const lesson of LESSONS) for (const char of newCharacters(lesson)) for (const { radical } of radicalsIn(char)) COURSE_USES.set(radical.id, (COURSE_USES.get(radical.id) ?? 0) + 1)

const TAUGHT_IN = new Map<number, CourseLesson>()
{
  const taught = new Set<number>()
  const waiting = new Set<number>()
  for (const lesson of LESSONS) {
    // Most used in this lesson first; ties go to meaning parts, radicals left over from earlier lessons,
    // then radicals used most across the course.
    const chars = newCharacters(lesson).map((char) => ({ char, found: radicalsIn(char) }))
    const uses = new Map<number, { count: number; semantic: boolean }>()
    for (const { found } of chars) for (const { radical, semantic } of found) {
      const u = uses.get(radical.id) ?? { count: 0, semantic: false }
      uses.set(radical.id, { count: u.count + 1, semantic: u.semantic || semantic })
    }
    const fresh = [...uses].filter(([id]) => !taught.has(id))
      .sort(([a, x], [b, y]) => y.count - x.count || Number(y.semantic) - Number(x.semantic)
        || Number(waiting.has(b)) - Number(waiting.has(a)) || (COURSE_USES.get(b) ?? 0) - (COURSE_USES.get(a) ?? 0) || a - b)
      .slice(0, RADICALS_PER_LESSON).map(([id]) => id)
    const known = [...uses.keys()].filter((id) => taught.has(id))
    for (const id of fresh) { taught.add(id); waiting.delete(id); TAUGHT_IN.set(id, lesson) }
    const later = [...uses.keys()].filter((id) => !taught.has(id))
    for (const id of later) waiting.add(id)
    const status = (id: number): PartStatus => (fresh.includes(id) ? 'taught' : known.includes(id) ? 'known' : 'later')
    INFO.set(lesson.id, {
      lesson,
      taught: fresh.map((id) => RADICAL_BY_ID.get(id)!),
      known: known.map((id) => RADICAL_BY_ID.get(id)!),
      later: later.map((id) => RADICAL_BY_ID.get(id)!),
      chars: chars.map(({ char, found }) => ({ char, radicals: found.map(({ radical, glyph, semantic }) => ({ radical, glyph, semantic, status: status(radical.id) })) })),
    })
  }
}

export function lessonRadicals(lessonId: string): LessonRadicalInfo | undefined {
  return INFO.get(lessonId)
}

/** The lesson whose "Chữ & bộ thủ" part teaches this radical. */
export function taughtIn(radicalId: number): CourseLesson | undefined {
  return TAUGHT_IN.get(radicalId)
}

/** Every radical the course teaches, in lesson order. */
export const TAUGHT_RADICALS = [...TAUGHT_IN.keys()].map((id) => RADICAL_BY_ID.get(id)!)

export interface PhoneticFamily {
  /** The sound part shared by the characters, e.g. 青. */
  phonetic: string
  /** Course characters using it: earlier lessons first, then this lesson's (isNew). */
  members: { char: string; isNew: boolean }[]
}

/** Sound-part families for a lesson's new picto-phonetic characters (青 → 请 清 情 晴), at most three. */
export function phoneticFamilies(lessonId: string, limit = 3): PhoneticFamily[] {
  const at = LESSONS.findIndex((l) => l.id === lessonId)
  if (at < 0) return []
  const earlier = LESSONS.slice(0, at).flatMap((l) => newCharacters(l))
  const fresh = newCharacters(LESSONS[at])
  const byPhonetic = new Map<string, PhoneticFamily>()
  const add = (char: string, isNew: boolean) => {
    const phonetic = CHAR_COMPONENTS.get(char)?.phonetic
    if (!phonetic) return
    const family = byPhonetic.get(phonetic) ?? { phonetic, members: [] }
    family.members.push({ char, isNew })
    byPhonetic.set(phonetic, family)
  }
  for (const char of earlier) add(char, false)
  for (const char of fresh) add(char, true)
  return [...byPhonetic.values()]
    .filter((f) => f.members.some((m) => m.isNew) && f.members.length >= 2)
    .sort((a, b) => b.members.length - a.members.length)
    .slice(0, limit)
}
