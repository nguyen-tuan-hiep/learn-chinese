import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Layers } from 'lucide-react'
import { Button, ButtonLink, Card } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LargeTitle } from '@/components/ui/PageHeader'
import { TipBubble } from '@/components/ui/TipBubble'
import { Segmented } from '@/components/ui/Segmented'
import { ProgressBar } from '@/components/ui/Progress'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { FlashCard } from '@/components/review/FlashCard'
import { ReviewControls } from '@/components/review/ReviewControls'
import { ReviewSkeleton, rememberReviewDeck } from '@/components/review/ReviewSkeleton'
import { useCourse } from '@/lib/courseModel'
import { speak } from '@/lib/speech'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { useSettings } from '@/store/settings'
import { shuffle } from '@/lib/shuffle'

/** Flashcard review for HSK 2.0 and 3.0: one page driven by the course model's review deck. */
export function ReviewPage() {
  useStudyTimer()
  const { loaded, reviewDeck: words, version } = useCourse()
  const speechRate = useSettings((state) => state.speechRate)
  // Shuffled order as indices into `words`; null keeps lesson order.
  const [order, setOrder] = useState<number[] | null>(null)
  const deck = useMemo(() => order && order.length === words.length ? order.map((i) => words[i]) : words, [order, words])
  useEffect(() => { if (loaded) rememberReviewDeck(deck.length > 0) }, [loaded, deck.length])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(0, words.length - 1)))
    setOrder((current) => (current && current.length !== words.length ? shuffle(words.map((_, i) => i)) : current))
    setRevealed(false)
  }, [words.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const reshuffle = () => { setOrder(shuffle(words.map((_, i) => i))); setIndex(0); setRevealed(false) }
  const inOrder = () => { setOrder(null); setIndex(0); setRevealed(false) }

  // Which way the last move went, so the next card slides in from that side.
  const [direction, setDirection] = useState(1)
  const move = useCallback((offset: number) => {
    if (!deck.length) return
    setDirection(offset)
    setIndex((current) => (current + offset + deck.length) % deck.length)
    setRevealed(false)
  }, [deck.length])
  const flip = useCallback(() => setRevealed((value) => !value), [])

  const current = deck[Math.min(index, deck.length - 1)]
  const hanzi = useRef('')
  hanzi.current = current?.hanzi ?? ''
  useEffect(() => {
    if (!deck.length) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target
      if (target instanceof HTMLElement && target.matches('input, textarea, select, [contenteditable="true"]')) return
      if (target instanceof HTMLElement && target.matches('button, a, [role="button"]') && (event.code === 'Space' || event.key === ' ' || event.key === 'Enter')) return
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault()
        flip()
      } else if (event.key === 'Enter') {
        event.preventDefault()
        void speak(hanzi.current, speechRate)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        move(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        move(-1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [deck.length, move, flip, speechRate])

  if (!loaded) return <ReviewSkeleton />
  const is3 = version === '3.0'

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 pt-6 pb-10 sm:pt-8">
      <LargeTitle eyebrow="Flashcard" title="Ôn tập" aside={deck.length > 0 && <div className="flex flex-wrap items-center gap-2">
        <Badge tone="tint" className="text-footnote"><AnimatedNumber value={deck.length} /> thẻ</Badge>
        <Segmented label="Thứ tự thẻ" value={order ? 'shuffle' : 'lesson'} onChange={(v) => (v === 'lesson' ? inOrder() : reshuffle())}
          options={[{ value: 'lesson', label: 'Theo bài' }, { value: 'shuffle', label: 'Trộn ngẫu nhiên' }]} />
        {order && <Button variant="ghost" size="sm" onClick={reshuffle}>Trộn lại</Button>}
      </div>}>
        Từ mới của các bài bạn đã học. Nhớ cách đọc và nghĩa trước, rồi mới lật thẻ.
      </LargeTitle>
      <TipBubble>{deck.length > 0 ? <>Đọc to từ trước khi lật thẻ, nhớ lâu hơn nhiều đó!</> : <>Học xong phần Từ mới của một bài là có thẻ để ôn nhé!</>}</TipBubble>

      {deck.length === 0 ? (
        <Card raised className="rounded-panel p-8 text-center sm:p-10">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-tint-soft text-tint-text" aria-hidden="true"><Layers className="size-9" strokeWidth={1.75} /></span>
          <h2 className="mt-4 text-title3">Chưa có flashcard</h2>
          <p className="mx-auto mt-2 max-w-md text-callout text-secondary-label text-pretty">
            {is3 ? 'Đánh dấu “Đã nhớ” cho các từ trong bài HSK 3.0, từ đó sẽ xuất hiện ở đây.'
              : 'Học xong phần Từ mới (hoặc phần Bài tập) của một bài, từ mới của bài đó sẽ thành thẻ ôn ở đây.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/lesson" size="lg">Đến bài học</ButtonLink>
            {!is3 && <ButtonLink to="/pronunciation?tab=tones" variant="secondary" size="lg">Luyện thanh điệu</ButtonLink>}
          </div>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <ProgressBar tone="gradient" value={(index + 1) / deck.length} className="h-1.5 flex-1" />
            <span className="shrink-0 text-subhead text-secondary-label tabular-nums"><AnimatedNumber value={index + 1} />/{deck.length}</span>
          </div>
          <FlashCard card={current} revealed={revealed} direction={direction} onFlip={flip} />
          <p role="status" aria-live="polite" className="sr-only">{revealed ? `Mặt sau: ${current.pinyin}, ${current.meaning}` : `Mặt trước: ${current.hanzi}`}</p>
          <ReviewControls revealed={revealed} canMove={deck.length > 1} onPrev={() => move(-1)} onNext={() => move(1)} onFlip={flip} />
        </>
      )}
    </div>
  )
}
