import { db, type LessonState } from './db'

/** Mark lessons or sessions as skipped (not learned), or undo that. */
export async function setSkipped(lessonIds: string[], skipped: boolean) {
  await db.transaction('rw', db.lessonState, async () => {
    for (const lessonId of lessonIds) {
      const s = (await db.lessonState.get(lessonId)) ?? { lessonId, done: {} }
      await db.lessonState.put({ ...s, skipped })
    }
  })
}

/** Mark every word of a lesson remembered, so the lesson counts as done (words already learned keep their date),
 *  or with `learned = false` forget them all, so it is not done again. */
export async function markLearned(wordIds: string[], learned = true) {
  await db.transaction('rw', db.lessonState, async () => {
    const rows = await db.lessonState.bulkGet(wordIds)
    const now = Date.now()
    await db.lessonState.bulkPut(wordIds.map((id, i) => {
      const s = rows[i] ?? { lessonId: id, done: {} }
      if (!learned) { const { vocab: _, ...rest } = s.done; return { ...s, done: rest } }
      return s.done.vocab ? s : { ...s, done: { ...s.done, vocab: now } }
    }))
  })
}

export const isSkipped = (state: Map<string, LessonState>, id: string) => !!state.get(id)?.skipped
