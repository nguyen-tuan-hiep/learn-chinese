import { createEmptyCard, Rating, State, type Grade } from 'ts-fsrs'
import { db, type StoredCard, type StoredReview } from './db'
import { createFsrs6Scheduler } from './fsrsScheduler'
import { dateKey } from './progress'
import { useSettings } from '@/store/settings'

export { Rating, State }
export type { Grade }

/** Build from current preferences so changes take effect on the next answer without rewriting existing due dates. */
export function getScheduler() {
  const { desiredRetention, maximumInterval, fsrsWeights } = useSettings.getState()
  const retention = Math.min(0.99, Math.max(0.7, desiredRetention))
  const maxDays = Math.min(36500, Math.max(1, Math.round(maximumInterval)))
  return createFsrs6Scheduler({ desiredRetention: retention, maximumInterval: maxDays, weights: fsrsWeights })
}

/** A card counts as "known" once FSRS expects it to survive three weeks. */
export const MATURE_DAYS = 21

export function newCard(ref: string, lessonId: string, now = new Date()): StoredCard {
  return { ...createEmptyCard(now), id: `flash:${ref}`, kind: 'flash', ref, lessonId, createdAt: now }
}

/** Apply a grade to a card, returning the next card state and the review log row. */
export function applyGrade(card: StoredCard, grade: Grade, now = new Date()): { card: StoredCard; review: StoredReview } {
  const { card: next, log } = getScheduler().next(card, now, grade)
  return {
    card: { ...card, ...next },
    review: { ...log, cardId: card.id, kind: card.kind, date: dateKey(now) },
  }
}

export async function grade(card: StoredCard, rating: Grade, now = new Date()): Promise<StoredCard> {
  const { card: next, review } = applyGrade(card, rating, now)
  await db.transaction('rw', db.cards, db.reviews, async () => {
    await db.cards.put(next)
    await db.reviews.add(review)
  })
  return next
}

/** Due cards, interleaved so the same word's cards don't sit next to each other. */
export function orderDue(cards: StoredCard[], now = new Date()): StoredCard[] {
  const due = cards.filter((c) => c.due.getTime() <= now.getTime())
  const learning = due.filter((c) => c.state === State.Learning || c.state === State.Relearning)
  const review = due.filter((c) => !(c.state === State.Learning || c.state === State.Relearning))
  // Overdue reviews first (most forgotten), then learning steps by due time.
  review.sort((a, b) => a.due.getTime() - b.due.getTime())
  learning.sort((a, b) => a.due.getTime() - b.due.getTime())
  const merged = [...review, ...learning]
  for (let i = 1; i < merged.length; i++) {
    if (merged[i].ref === merged[i - 1].ref) {
      const j = merged.findIndex((c, k) => k > i && c.ref !== merged[i].ref)
      if (j > 0) [merged[i], merged[j]] = [merged[j], merged[i]]
    }
  }
  return merged
}

export interface SrsStats {
  total: number
  mature: number
  learning: number
  dueNow: number
  /** Share of review-state cards recalled (not "Again") over the last 30 days; null with too little data. */
  retention: number | null
  retentionSample: number
  /** Cards due on each of the next 7 days (index 0 = today, includes overdue). */
  forecast: number[]
  reviewsToday: number
}

export function computeStats(cards: StoredCard[], reviews: StoredReview[], now = new Date()): SrsStats {
  const today = dateKey(now)
  const since = new Date(now.getTime() - 30 * 86_400_000)
  const graded = reviews.filter((r) => r.state === State.Review && r.review >= since)
  const endOfDay = (d: number) => {
    const e = new Date(now)
    e.setHours(23, 59, 59, 999)
    e.setDate(e.getDate() + d)
    return e.getTime()
  }
  const forecast = Array.from({ length: 7 }, (_, d) =>
    cards.filter((c) => c.due.getTime() <= endOfDay(d) && (d === 0 || c.due.getTime() > endOfDay(d - 1))).length,
  )
  return {
    total: cards.length,
    mature: cards.filter((c) => c.state === State.Review && c.stability >= MATURE_DAYS).length,
    learning: cards.filter((c) => c.state !== State.Review).length,
    dueNow: cards.filter((c) => c.due.getTime() <= now.getTime()).length,
    retention: graded.length >= 10 ? graded.filter((r) => r.rating !== Rating.Again).length / graded.length : null,
    retentionSample: graded.length,
    forecast,
    reviewsToday: reviews.filter((r) => r.date === today).length,
  }
}
