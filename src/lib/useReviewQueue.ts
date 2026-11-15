import { useMemo } from 'react'
import { useCourse } from './courseModel'
import { useStudyData } from './useStudyData'
import { buildQueue } from './reviewQueue'

/** Today's FSRS queue for the chosen HSK version (refreshes with the study data clock, every 15 s). */
export function useReviewQueue() {
  const { reviewDeck } = useCourse()
  const { cards, reviews, now } = useStudyData()
  return useMemo(() => buildQueue(reviewDeck, cards, reviews, now), [reviewDeck, cards, reviews, now])
}
