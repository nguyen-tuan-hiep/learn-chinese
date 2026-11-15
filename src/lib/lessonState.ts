import { db, type LessonPart, type LessonState } from './db'

export async function markPart(lessonId: string, part: LessonPart, needsPractice?: boolean) {
  await db.transaction('rw', db.lessonState, async () => {
    const s = (await db.lessonState.get(lessonId)) ?? { lessonId, done: {} }
    await db.lessonState.put({
      ...s,
      done: { ...s.done, [part]: s.done[part] ?? Date.now() },
      ...(needsPractice === undefined ? {} : { needsPractice: { ...s.needsPractice, [part]: needsPractice } }),
    })
  })
}

export async function unmarkPart(lessonId: string, part: LessonPart) {
  await db.transaction('rw', db.lessonState, async () => {
    const state = await db.lessonState.get(lessonId)
    if (!state) return
    const done = { ...state.done }
    delete done[part]
    const needsPractice = { ...state.needsPractice }
    delete needsPractice[part]
    await db.lessonState.put({
      ...state,
      done,
      ...(Object.keys(needsPractice).length ? { needsPractice } : { needsPractice: undefined }),
    })
  })
}

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
