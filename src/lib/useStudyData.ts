import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type LessonState } from './db'
import { dateKey, streakFrom } from './progress'
import { computeStats, type SrsStats } from './srs'

function useSharedStudyData() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const update = () => setNow(new Date())
    const timer = setInterval(update, 15000)
    window.addEventListener('focus', update)
    return () => { clearInterval(timer); window.removeEventListener('focus', update) }
  }, [])
  const since = dateKey(new Date(now.getTime() - 30 * 86_400_000))
  const data = useLiveQuery(async () => {
    const [cards, reviews, days, lessons] = await Promise.all([
      db.cards.toArray(), db.reviews.where('date').aboveOrEqual(since).toArray(), db.days.toArray(), db.lessonState.toArray(),
    ])
    return { cards, reviews, days, lessons }
  }, [since])
  return useMemo(() => {
    const today = dateKey(now)
    const stats: SrsStats | null = data ? computeStats(data.cards, data.reviews, now) : null
    const lessonState = new Map<string, LessonState>((data?.lessons ?? []).map((l) => [l.lessonId, l]))
    return {
      loaded: !!data, cards: data?.cards ?? [], reviews: data?.reviews ?? [], days: data?.days ?? [], stats, lessonState,
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
