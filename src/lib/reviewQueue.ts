import type { StoredCard, StoredReview } from './db'
import type { ReviewWord } from './courseModel'
import { dateKey } from './progress'
import { newCard, orderDue, State } from './srs'

/** New flashcards a day, as in Anki's default. "Học thêm" raises it for the day. */
export const NEW_PER_DAY = 20
/** With nothing else left, learning cards due within this window are shown early (Anki's "learn ahead"). */
export const LEARN_AHEAD_MS = 20 * 60_000

export interface QueueItem {
  word: ReviewWord
  card: StoredCard
  isNew: boolean
}

export interface ReviewQueue {
  items: QueueItem[]
  counts: { fresh: number; learning: number; review: number }
  /** New words beyond today's limit. */
  moreNew: number
  /** When the next card falls due, if the queue is empty. */
  nextDue: Date | null
}

const isLearning = (c: StoredCard) => c.state === State.Learning || c.state === State.Relearning

/**
 * Today's FSRS queue over the review deck: due cards (overdue reviews first, then learning steps),
 * then up to the daily limit of new words in lesson order, then learning cards a little early.
 * `graded` holds cards graded in this session, which win over the database rows until those catch up.
 */
export function buildQueue(deck: ReviewWord[], stored: StoredCard[], reviews: StoredReview[], now: Date, options: { extraNew?: number; graded?: Map<string, StoredCard> } = {}): ReviewQueue {
  const { extraNew = 0, graded } = options
  const words = new Map(deck.map((w) => [w.id, w]))
  const cards = new Map<string, StoredCard>()
  for (const c of stored) if (c.kind === 'flash' && words.has(c.ref)) cards.set(c.ref, c)
  for (const c of graded?.values() ?? []) {
    const old = cards.get(c.ref)
    if (!old || (c.last_review?.getTime() ?? 0) >= (old.last_review?.getTime() ?? 0)) cards.set(c.ref, c)
  }

  const today = dateKey(now)
  const newToday = new Set(reviews.filter((r) => r.kind === 'flash' && r.date === today && r.state === State.New).map((r) => r.cardId))
  for (const c of graded?.values() ?? []) if (c.reps === 1 && c.last_review && dateKey(c.last_review) === today) newToday.add(c.id)

  const all = [...cards.values()]
  const due = orderDue(all, now)
  const fresh = deck.filter((w) => !cards.has(w.id))
  const limit = Math.max(0, NEW_PER_DAY + extraNew - newToday.size)
  const newWords = fresh.slice(0, limit)

  let ahead: StoredCard[] = []
  if (!due.length && !newWords.length) {
    const soon = all.filter((c) => isLearning(c) && c.due.getTime() <= now.getTime() + LEARN_AHEAD_MS)
    ahead = orderDue(soon, new Date(now.getTime() + LEARN_AHEAD_MS))
  }
  const shown = [...due, ...ahead]
  const items: QueueItem[] = [
    ...shown.map((card) => ({ word: words.get(card.ref)!, card, isNew: false })),
    ...newWords.map((word) => ({ word, card: newCard('flash', word.id, word.lessonId, now), isNew: true })),
  ]

  const later = all.filter((c) => c.due.getTime() > now.getTime()).sort((a, b) => a.due.getTime() - b.due.getTime())
  return {
    items,
    counts: {
      fresh: newWords.length,
      learning: shown.filter(isLearning).length,
      review: shown.filter((c) => !isLearning(c)).length,
    },
    moreNew: fresh.length - newWords.length,
    nextDue: items.length ? null : later[0]?.due ?? null,
  }
}
