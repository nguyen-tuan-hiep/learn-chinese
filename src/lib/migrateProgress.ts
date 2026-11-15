import { HSK3_LESSONS, LESSONS, legacyHsk3WordId } from '@/data/course'
import { db, type LessonState, type StoredCard } from './db'

/** Written once the HSK 2.0 multi-part progress has been moved to the CSV word lists. */
const MARKER = '__migrated:csv-courses'

/** Old HSK 3.0 numeric ids overlapped, so one old id can stand for several words; all of them keep the progress. */
const legacy3 = new Map<string, string[]>()
for (const lesson of HSK3_LESSONS) lesson.words.forEach((word, index) => {
  const key = `hsk3-vocab-${legacyHsk3WordId(lesson.level, lesson.number, index)}`
  legacy3.set(key, [...(legacy3.get(key) ?? []), word.id])
})

/** Old HSK 2.0 word ids were `hsk{level}-w{hanzi}`; the new list's first word with that hanzi in the level takes over. */
const legacy2 = new Map<string, string>()
for (const lesson of LESSONS) for (const word of lesson.words) {
  const key = `hsk${lesson.level}-w${word.hanzi}`
  if (!legacy2.has(key)) legacy2.set(key, word.id)
}

const OLD_PARTS = ['grammar', 'confusables', 'exercises', 'writing', 'dialogue', 'reading'] as const

const remembered = (lessonId: string, at: number): LessonState => ({ lessonId, done: { vocab: at } })

/**
 * Move saved progress to the CSV-based courses. Safe to run on every load:
 * - HSK 3.0 word rows and flashcards with numeric ids get the new string ids.
 * - HSK 2.0 (once): a lesson whose old Từ mới or Bài tập part was done marks every word of the new list as remembered;
 *   the old part keys are dropped, Bộ thủ (chars) is kept for the radicals count; flashcards follow their word.
 */
export async function migrateCourseProgress() {
  await db.transaction('rw', db.lessonState, db.cards, db.reviews, async () => {
    const rows = await db.lessonState.toArray()
    const byId = new Map(rows.map((row) => [row.lessonId, row]))
    const put = async (row: LessonState) => {
      const existing = byId.get(row.lessonId)
      if (existing?.done.vocab) return
      const next = { ...existing, ...row, done: { ...existing?.done, ...row.done } }
      byId.set(row.lessonId, next)
      await db.lessonState.put(next)
    }

    for (const row of rows) {
      const ids = legacy3.get(row.lessonId)
      if (!ids) continue
      if (row.done.vocab) for (const id of ids) await put(remembered(id, row.done.vocab))
      await db.lessonState.delete(row.lessonId)
    }

    if (!byId.has(MARKER)) {
      for (const lesson of LESSONS) {
        const row = byId.get(lesson.id)
        if (!row) continue
        const at = row.done.vocab ?? row.done.exercises
        if (at) for (const word of lesson.words) await put(remembered(word.id, at))
        const done = { ...row.done }
        for (const part of OLD_PARTS) delete done[part]
        if (at) done.vocab = at
        const next: LessonState = { ...row, done, needsPractice: undefined }
        byId.set(lesson.id, next)
        await db.lessonState.put(next)
      }
      await db.lessonState.put({ lessonId: MARKER, done: {} })
    }

    for (const card of await db.cards.where('kind').equals('flash').toArray()) {
      const refs = legacy3.get(card.ref) ?? (legacy2.has(card.ref) ? [legacy2.get(card.ref)!] : null)
      if (!refs) continue
      for (const [i, ref] of refs.entries()) {
        const id = `flash:${ref}`
        if (await db.cards.get(id)) continue
        const lessonId = [...LESSONS, ...HSK3_LESSONS].find((l) => l.words.some((w) => w.id === ref))?.id ?? card.lessonId
        const moved: StoredCard = { ...card, id, ref, lessonId }
        await db.cards.put(moved)
        if (i === 0) await db.reviews.where('cardId').equals(card.id).modify({ cardId: id })
      }
      await db.cards.delete(card.id)
    }
  })
}
