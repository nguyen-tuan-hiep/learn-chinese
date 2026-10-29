import { describe, expect, it } from 'vitest'
import { dateKey, streakFrom } from './progress'

const day = (date: string, seconds = 600) => ({ date, seconds })
const today = new Date(2026, 9, 29)

describe('streak', () => {
  it('is 0 with no study', () => expect(streakFrom([], today)).toBe(0))
  it('counts back from today', () => expect(streakFrom([day('2026-10-29'), day('2026-10-28'), day('2026-10-26')], today)).toBe(2))
  it('keeps yesterday’s streak alive before studying today', () => expect(streakFrom([day('2026-10-28'), day('2026-10-27')], today)).toBe(2))
  it('ignores days under a minute', () => expect(streakFrom([day('2026-10-29', 30)], today)).toBe(0))
  it('crosses months', () => expect(streakFrom([day('2026-11-01'), day('2026-10-31')], new Date(2026, 10, 1))).toBe(2))
  it('formats local dates', () => expect(dateKey(today)).toBe('2026-10-29'))
})
