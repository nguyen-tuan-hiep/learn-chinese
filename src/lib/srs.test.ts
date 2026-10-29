import { describe, expect, it } from 'vitest'
import { applyGrade, computeStats, newCard, orderDue, Rating, State } from './srs'
import type { StoredCard, StoredReview } from './db'

const t0 = new Date(2026, 9, 29, 9, 0)
const mins = (d: Date) => (d.getTime() - t0.getTime()) / 60_000

describe('scheduling', () => {
  it('Again on a new card comes back within the session', () => {
    const { card } = applyGrade(newCard('recall', 'w', 'l', t0), Rating.Again, t0)
    expect(card.state).toBe(State.Learning)
    expect(mins(card.due)).toBeGreaterThan(0)
    expect(mins(card.due)).toBeLessThanOrEqual(20)
    expect(orderDue([card], t0)).toEqual([])
    expect(orderDue([card], card.due)).toHaveLength(1)
  })

  it('Good intervals grow across successful reviews', () => {
    let card: StoredCard = newCard('recall', 'w', 'l', t0)
    const gaps: number[] = []
    let now = t0
    for (let i = 0; i < 5; i++) {
      card = applyGrade(card, Rating.Good, now).card
      gaps.push(card.due.getTime() - now.getTime())
      now = card.due
    }
    for (let i = 2; i < gaps.length; i++) expect(gaps[i]).toBeGreaterThan(gaps[i - 1])
    expect(card.state).toBe(State.Review)
  })

  it('a lapse sends a mature card back to relearning', () => {
    let card: StoredCard = newCard('recall', 'w', 'l', t0)
    let now = t0
    for (let i = 0; i < 6; i++) {
      card = applyGrade(card, Rating.Good, now).card
      now = card.due
    }
    const lapsed = applyGrade(card, Rating.Again, now).card
    expect(lapsed.state).toBe(State.Relearning)
    expect(lapsed.lapses).toBe(1)
  })
})

describe('orderDue', () => {
  it('only includes cards actually due now and spreads siblings apart', () => {
    const mk = (kind: 'recall' | 'listen', ref: string, dueMin: number): StoredCard => ({
      ...newCard(kind, ref, 'l', t0),
      due: new Date(t0.getTime() + dueMin * 60_000),
      state: State.Review,
    })
    const cards = [mk('recall', 'a', -10), mk('listen', 'a', -9), mk('recall', 'b', -8), mk('recall', 'c', 1)]
    const order = orderDue(cards, t0).map((c) => c.id)
    expect(order).toHaveLength(3)
    expect(order).not.toContain('recall:c')
    expect(order[0]).toBe('recall:a')
    expect(order[1]).toBe('recall:b')
  })
})

describe('computeStats', () => {
  it('counts mature cards and forecasts', () => {
    const mature: StoredCard = { ...newCard('recall', 'a', 'l', t0), state: State.Review, stability: 30, due: new Date(t0.getTime() + 2 * 86_400_000) }
    const fresh = applyGrade(newCard('recall', 'b', 'l', t0), Rating.Good, t0)
    const s = computeStats([mature, fresh.card], [fresh.review as StoredReview], t0)
    expect(s.total).toBe(2)
    expect(s.mature).toBe(1)
    expect(s.forecast[0]).toBe(1)
    expect(s.forecast[2]).toBe(1)
    expect(s.retention).toBeNull()
    expect(s.reviewsToday).toBe(1)
  })
})
