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

export const isSkipped = (state: Map<string, LessonState>, id: string) => !!state.get(id)?.skipped
