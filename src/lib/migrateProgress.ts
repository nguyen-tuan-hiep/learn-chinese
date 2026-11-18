import { HSK3_LESSONS, HSK2_LESSONS, legacyHsk3WordId, legacyIds } from '@/data/course'
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
for (const lesson of HSK2_LESSONS) for (const word of lesson.words) {
  const key = `hsk${lesson.level}-w${word.hanzi}`
  if (!legacy2.has(key)) legacy2.set(key, word.id)
}

const OLD_PARTS = ['grammar', 'confusables', 'exercises', 'writing', 'dialogue', 'reading'] as const

const remembered = (lessonId: string, at: number): LessonState => ({ lessonId, done: { vocab: at } })

/**
 * Progress rows, cards and their reviews saved under the old lesson and word ids move to the shared id shape (see
 * legacyIds). Where a row already exists under the new id, both are merged and the newer row's values win.
 */
async function renameLegacyIds() {
  const ids = legacyIds()
  for (const row of await db.lessonState.toArray()) {
    const to = ids.get(row.lessonId)
    if (!to) continue
    const existing = await db.lessonState.get(to)
    await db.lessonState.put(existing
      ? { ...row, ...existing, lessonId: to, done: { ...row.done, ...existing.done }, needsPractice: existing.needsPractice ?? row.needsPractice }
      : { ...row, lessonId: to })
    await db.lessonState.delete(row.lessonId)
  }
  for (const card of await db.cards.toArray()) {
    const ref = ids.get(card.ref) ?? card.ref
    const lessonId = ids.get(card.lessonId) ?? card.lessonId
    if (ref === card.ref && lessonId === card.lessonId) continue
    const id = ref === card.ref ? card.id : `${card.kind}:${ref}`
    if (id === card.id) { await db.cards.update(card.id, { lessonId }); continue }
    if (!(await db.cards.get(id))) await db.cards.put({ ...card, id, cardId: id, ref, lessonId })
    await db.reviews.where('cardId').equals(card.id).modify({ cardId: id })
    await db.cards.delete(card.id)
  }
}

/**
 * Move saved progress to the CSV-based courses. Safe to run on every load:
 * - Lesson and word ids of both courses get the shared shape (`hsk2-1-03`, `hsk2-1-03-0`); this runs first, so the steps below see new ids.
 * - HSK 3.0 word rows and flashcards with numeric ids get the new string ids.
 * - HSK 2.0 (once): a lesson whose old New words or Exercises part was done marks every word of the new list as remembered;
 *   the old part keys are dropped, the Radicals part (chars) is kept for the radicals count; flashcards follow their word.
 */
export async function migrateCourseProgress() {
  await db.transaction('rw', db.lessonState, db.cards, db.reviews, async () => {
    await renameLegacyIds()
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
      for (const lesson of HSK2_LESSONS) {
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
        const lessonId = [...HSK2_LESSONS, ...HSK3_LESSONS].find((l) => l.words.some((w) => w.id === ref))?.id ?? card.lessonId
        const moved: StoredCard = { ...card, id, cardId: id, ref, lessonId }
        await db.cards.put(moved)
        if (i === 0) await db.reviews.where('cardId').equals(card.id).modify({ cardId: id })
      }
      await db.cards.delete(card.id)
    }
  })
}
