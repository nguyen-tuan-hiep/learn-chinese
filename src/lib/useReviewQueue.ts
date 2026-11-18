import { useMemo } from 'react'
import { useCourse } from './courseModel'
import { useStudyData } from './useStudyData'
import { buildQueue } from './reviewQueue'
import { useSettings } from '@/store/settings'

/** Today's FSRS queue for the chosen HSK version (refreshes with the study data clock, every 15 s). */
export function useReviewQueue() {
  const { reviewDeck } = useCourse()
  const { cards, reviews, now } = useStudyData()
  const newCardsPerDay = useSettings((state) => state.newCardsPerDay)
  const learnAheadMinutes = useSettings((state) => state.learnAheadMinutes)
  return useMemo(() => buildQueue(reviewDeck, cards, reviews, now, { newCardsPerDay, learnAheadMinutes }), [reviewDeck, cards, reviews, now, newCardsPerDay, learnAheadMinutes])
}
