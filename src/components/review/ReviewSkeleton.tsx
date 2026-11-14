import { Block, Line, SkeletonPage } from '@/components/ui/Skeleton'
import { Card } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'

// Whether the deck had cards last time, so the placeholder can take the matching shape.
const DECK_KEY = 'hanyu:review-has-deck'
/** Remember whether the review deck had cards, to pick the matching skeleton next load. */
export function rememberReviewDeck(hasCards: boolean) {
  try { localStorage.setItem(DECK_KEY, hasCards ? '1' : '0') } catch { /* storage unavailable */ }
}
function hadReviewDeck() {
  try { return localStorage.getItem(DECK_KEY) === '1' } catch { return false }
}

/** Placeholder shaped like the review page (deck or empty state). */
export function ReviewSkeleton() {
  const deck = hadReviewDeck()
  return <SkeletonPage label="Đang tải thẻ ôn tập" className="mx-auto w-full max-w-2xl space-y-6 pt-6 pb-10 sm:pt-8">
    <PageHeader eyebrow="Flashcard" title="Ôn tập" aside={deck && <Block className="h-11 w-72 max-w-full rounded-full" />}>Từ mới của các bài bạn đã học. Nhớ cách đọc và nghĩa trước, rồi mới lật thẻ.</PageHeader>
    {deck ? <>
      <div className="flex items-center gap-3"><Block className="h-1.5 flex-1 rounded-full" /><Line className="text-subhead" w="2.5rem" /></div>
      <Card raised className="flex h-[340px] flex-col items-center justify-center gap-5 rounded-panel sm:h-[380px]">
        <Line className="font-han text-8xl leading-tight" w="9rem" />
        <Line className="text-subhead" w="7rem" />
      </Card>
      <div className="flex items-center justify-center gap-4">
        <Block className="size-14 rounded-full" /><Block className="min-h-12 w-40 rounded-full" /><Block className="size-14 rounded-full" />
      </div>
    </> : <Card raised className="p-8 text-center sm:p-10">
      <Block className="mx-auto size-20 rounded-full" />
      <h2 className="mt-4 text-title3">Chưa có flashcard</h2>
      <p className="mx-auto mt-2 max-w-md text-callout text-secondary-label">Học xong phần Từ mới (hoặc phần Bài tập) của một bài, từ mới của bài đó sẽ thành thẻ ôn ở đây.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3"><Block className="min-h-12 w-40 rounded-full" /><Block className="min-h-12 w-44 rounded-full" /></div>
    </Card>}
  </SkeletonPage>
}
