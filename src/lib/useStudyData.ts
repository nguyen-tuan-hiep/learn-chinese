import { createContext, createElement, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LessonState } from './db'
import { WORDS, wordKey } from '@/data/course'
import { dateKey, streakFrom } from './progress'
import { computeStats, type SrsStats } from './srs'

function useSharedStudyData() {
  const migratedWordRefs = useRef(false)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const update = () => setNow(new Date())
    const timer = setInterval(update, 15000)
    window.addEventListener('focus', update)
    return () => { clearInterval(timer); window.removeEventListener('focus', update) }
  }, [])
  const since = dateKey(new Date(now.getTime() - 30 * 86_400_000))
  const data = useLiveQuery(async () => {
    const [cards, reviews, days, lessons, studyPlan, planDays, planWeeks] = await Promise.all([
      db.cards.toArray(), db.reviews.where('date').aboveOrEqual(since).toArray(), db.days.toArray(), db.lessonState.toArray(),
      db.studyPlans.get('main'), db.planDays.toArray(), db.planWeeks.toArray(),
    ])
    return { cards, reviews, days, lessons, studyPlan, planDays, planWeeks }
  }, [since])

  // Vocabulary moved from frequency batches to textbook lessons. Normalize
  // legacy lesson-prefixed references by stable word id and keep review logs.
  useEffect(() => {
    if (!data || migratedWordRefs.current) return
    migratedWordRefs.current = true
    void db.transaction('rw', db.cards, db.reviews, async () => {
      for (const card of await db.cards.toArray()) {
        if (!['recall', 'read', 'listen'].includes(card.kind)) continue
        const oldWordId = card.ref.slice(card.ref.lastIndexOf(':') + 1)
        const entry = WORDS.get(oldWordId)
        if (!entry) continue
        const ref = wordKey(entry.lesson, entry.word)
        const id = `${card.kind}:${ref}`
        if (card.ref === ref && card.lessonId === entry.lesson.id && card.id === id) continue
        if (await db.cards.get(id)) continue
        await db.reviews.where('cardId').equals(card.id).modify({ cardId: id })
        await db.cards.delete(card.id)
        await db.cards.put({ ...card, id, ref, lessonId: entry.lesson.id })
      }
    }).catch(() => { migratedWordRefs.current = false })
  }, [data])
  return useMemo(() => {
    const today = dateKey(now)
    const stats: SrsStats | null = data ? computeStats(data.cards, data.reviews, now) : null
    const lessonState = new Map<string, LessonState>((data?.lessons ?? []).map((l) => [l.lessonId, l]))
    return {
      loaded: !!data, cards: data?.cards ?? [], reviews: data?.reviews ?? [], days: data?.days ?? [], stats, lessonState,
      studyPlan: data?.studyPlan ?? null, planDays: data?.planDays ?? [], planWeeks: data?.planWeeks ?? [],
      minutesToday: Math.round((data?.days.find((d) => d.date === today)?.seconds ?? 0) / 60),
      streak: streakFrom(data?.days ?? []),
      newWordsToday: data ? new Set(data.cards.filter((c) => c.kind === 'recall' && dateKey(c.createdAt) === today).map((c) => c.ref)).size : 0,
    }
  }, [data, now])
}

const StudyContext = createContext<ReturnType<typeof useSharedStudyData> | null>(null)

/** One live subscription shared by the layout and pages; due counts also update with time. */
export function StudyDataProvider({ children }: { children: ReactNode }) {
  return createElement(StudyContext.Provider, { value: useSharedStudyData() }, children)
}

export function useStudyData() {
  const data = useContext(StudyContext)
  if (!data) throw new Error('useStudyData needs StudyDataProvider')
  return data
}
