import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarCheck, Layers } from 'lucide-react'
import { Button, ButtonLink, Card, Kbd } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LargeTitle } from '@/components/ui/PageHeader'
import { TipBubble } from '@/components/ui/TipBubble'
import { Segmented } from '@/components/ui/Segmented'
import { ProgressBar } from '@/components/ui/Progress'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { FlashCard } from '@/components/review/FlashCard'
import { ReviewControls } from '@/components/review/ReviewControls'
import { ReviewSkeleton, rememberReviewDeck } from '@/components/review/ReviewSkeleton'
import { RatingBar, formatInterval } from '@/components/srs/RatingBar'
import { useCourse, type ReviewWord } from '@/lib/courseModel'
import { useStudyData } from '@/lib/useStudyData'
import { buildQueue, NEW_PER_DAY } from '@/lib/reviewQueue'
import { grade, type Grade } from '@/lib/srs'
import type { StoredCard } from '@/lib/db'
import { speak } from '@/lib/speech'
import { notify } from '@/store/notch'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { useSettings } from '@/store/settings'
import { shuffle } from '@/lib/shuffle'

type Mode = 'due' | 'all'

/** Space flips, Enter reads the word aloud, ← → move (browse mode only). Ignored while typing or on a focused button. */
function useCardKeys({ hanzi, onFlip, onMove }: { hanzi: string; onFlip: () => void; onMove?: (offset: number) => void }) {
  const rate = useSettings((state) => state.speechRate)
  useEffect(() => {
    if (!hanzi) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target
      if (target instanceof HTMLElement && target.matches('input, textarea, select, [contenteditable="true"]')) return
      if (target instanceof HTMLElement && target.matches('button, a, [role="button"]') && (event.code === 'Space' || event.key === ' ' || event.key === 'Enter')) return
      if (event.code === 'Space' || event.key === ' ') { event.preventDefault(); onFlip() }
      else if (event.key === 'Enter') { event.preventDefault(); void speak(hanzi, rate) }
      else if (onMove && event.key === 'ArrowRight') { event.preventDefault(); onMove(1) }
      else if (onMove && event.key === 'ArrowLeft') { event.preventDefault(); onMove(-1) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [hanzi, onFlip, onMove, rate])
}

function CountPill({ label, value, dot }: { label: string; value: number; dot: string }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--glass-regular)] px-3 py-1.5 text-footnote font-semibold shadow-card">
    <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: dot }} />
    {label} <b className="tabular-nums">{value}</b>
  </span>
}

/**
 * Spaced repetition (FSRS, like Anki): one card at a time from today's queue.
 * Look at the word, recall its reading and meaning, flip, then grade how well you remembered;
 * FSRS sets when the card comes back.
 */
function ScheduledReview({ deck, onBrowse }: { deck: ReviewWord[]; onBrowse: () => void }) {
  const { cards, reviews, now: dataNow } = useStudyData()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { setNow(new Date()) }, [dataNow])
  const [graded, setGraded] = useState<Map<string, StoredCard>>(() => new Map())
  const [extraNew, setExtraNew] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [doneHere, setDoneHere] = useState(0)
  const queue = useMemo(() => buildQueue(deck, cards, reviews, now, { extraNew, graded }), [deck, cards, reviews, now, extraNew, graded])

  // Keep the card on screen until it is graded, even if the queue reorders underneath (new data, clock tick).
  const held = useRef<string | null>(null)
  const last = useRef<string | null>(null)
  let item = queue.items.find((i) => i.word.id === held.current)
  if (!item) {
    item = queue.items.find((i) => i.word.id !== last.current) ?? queue.items[0]
    held.current = item?.word.id ?? null
  }

  const flip = useCallback(() => setRevealed((v) => !v), [])
  useCardKeys({ hanzi: item?.word.hanzi ?? '', onFlip: flip })

  const rate = useCallback(async (g: Grade) => {
    if (!item || busy) return
    setBusy(true)
    setError('')
    try {
      const at = new Date()
      const next = await grade(item.card, g, at)
      notify({ icon: 'check', text: item.word.hanzi, zh: true, sub: `gặp lại sau ${formatInterval(next.due.getTime() - at.getTime())}` }, 1800)
      setGraded((m) => new Map(m).set(next.id, next))
      last.current = item.word.id
      held.current = null
      setRevealed(false)
      setDoneHere((n) => n + 1)
      setNow(new Date())
    } catch {
      setError('Không lưu được kết quả ôn. Hãy thử lại.')
    } finally {
      setBusy(false)
    }
  }, [item, busy])

  const { counts } = queue
  const left = counts.fresh + counts.learning + counts.review

  if (!item) return <Card raised className="rounded-panel p-8 text-center sm:p-10">
    <span className="mx-auto grid size-20 place-items-center rounded-full bg-[var(--pastel-green)] text-[#15120f]" aria-hidden="true"><CalendarCheck className="size-9" strokeWidth={1.75} /></span>
    <h2 className="mt-4 font-display text-title2 font-black">{doneHere > 0 ? 'Xong lượt ôn hôm nay!' : 'Chưa có thẻ đến hạn'}</h2>
    <p className="mx-auto mt-2 max-w-md text-callout text-secondary-label text-pretty">
      {doneHere > 0 && <>Bạn vừa ôn <b className="text-label">{doneHere}</b> thẻ. </>}
      {queue.nextDue ? <>Thẻ tiếp theo đến hạn sau {formatInterval(queue.nextDue.getTime() - now.getTime())}. </> : null}
      Ôn đúng lúc thẻ đến hạn giúp nhớ lâu mà không tốn thời gian.
    </p>
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {queue.moreNew > 0 && <Button size="lg" onClick={() => setExtraNew((n) => n + 10)}>Học thêm {Math.min(10, queue.moreNew)} từ mới</Button>}
      <Button size="lg" variant="secondary" onClick={onBrowse}>Xem tất cả thẻ</Button>
    </div>
  </Card>

  return <>
    <div className="flex flex-wrap items-center gap-2">
      <CountPill label="Mới" value={counts.fresh} dot="var(--color-level-1)" />
      <CountPill label="Đang học" value={counts.learning} dot="var(--color-streak)" />
      <CountPill label="Đến hạn" value={counts.review} dot="var(--color-success)" />
      {doneHere > 0 && <span className="ml-auto text-footnote text-secondary-label tabular-nums">Đã ôn {doneHere} · còn {left}</span>}
    </div>
    <div className="relative">
      {item.isNew && <span className="absolute -top-2 right-4 z-10 rounded-full bg-[#15120f] px-3 py-1 text-caption font-bold text-white dark:bg-[#f3eee4] dark:text-[#15120f]">Từ mới</span>}
      <FlashCard card={item.word} revealed={revealed} direction={1} onFlip={flip} />
    </div>
    <p role="status" aria-live="polite" className="sr-only">{revealed ? `Mặt sau: ${item.word.pinyin}, ${item.word.meaning}. Chọn mức độ nhớ.` : `Mặt trước: ${item.word.hanzi}`}</p>
    {revealed
      ? <RatingBar card={item.card} onRate={(g) => void rate(g)} disabled={busy} />
      : <div className="flex justify-center"><Button size="lg" onClick={flip} className="min-w-56">Hiện đáp án</Button></div>}
    {error && <p role="alert" className="text-center text-footnote text-danger">{error}</p>}
    <p className="hidden text-center text-caption text-secondary-label sm:block">
      <Kbd>Space</Kbd> lật thẻ <span className="mx-1">·</span> <Kbd>1</Kbd>–<Kbd>4</Kbd> Quên / Khó / Nhớ / Dễ <span className="mx-1">·</span> <Kbd>Enter</Kbd> nghe phát âm
    </p>
  </>
}

/** Free browsing of every card, in lesson or shuffled order; nothing is graded. */
function BrowseDeck({ words }: { words: ReviewWord[] }) {
  // Shuffled order as indices into `words`; null keeps lesson order.
  const [order, setOrder] = useState<number[] | null>(null)
  const deck = useMemo(() => order && order.length === words.length ? order.map((i) => words[i]) : words, [order, words])
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
  useCardKeys({ hanzi: current?.hanzi ?? '', onFlip: flip, onMove: move })
  if (!current) return null

  return <>
    <div className="flex flex-wrap items-center gap-2">
      <Segmented label="Thứ tự thẻ" value={order ? 'shuffle' : 'lesson'} onChange={(v) => (v === 'lesson' ? inOrder() : reshuffle())}
        options={[{ value: 'lesson', label: 'Theo bài' }, { value: 'shuffle', label: 'Trộn ngẫu nhiên' }]} />
      {order && <Button variant="ghost" size="sm" onClick={reshuffle}>Trộn lại</Button>}
    </div>
    <div className="flex items-center gap-3">
      <ProgressBar tone="gradient" value={(index + 1) / deck.length} className="h-1.5 flex-1" />
      <span className="shrink-0 text-subhead text-secondary-label tabular-nums"><AnimatedNumber value={index + 1} />/{deck.length}</span>
    </div>
    <FlashCard card={current} revealed={revealed} direction={direction} onFlip={flip} />
    <p role="status" aria-live="polite" className="sr-only">{revealed ? `Mặt sau: ${current.pinyin}, ${current.meaning}` : `Mặt trước: ${current.hanzi}`}</p>
    <ReviewControls revealed={revealed} canMove={deck.length > 1} onPrev={() => move(-1)} onNext={() => move(1)} onFlip={flip} />
  </>
}

/** Flashcard review for HSK 2.0 and 3.0: today's FSRS queue, or browse every card freely. */
export function ReviewPage() {
  useStudyTimer()
  const { loaded, reviewDeck: words, version } = useCourse()
  const [params, setParams] = useSearchParams()
  const mode: Mode = params.get('mode') === 'all' ? 'all' : 'due'
  const setMode = (m: Mode) => setParams(m === 'all' ? { mode: 'all' } : {}, { replace: true })
  useEffect(() => { if (loaded) rememberReviewDeck(words.length > 0) }, [loaded, words.length])

  if (!loaded) return <ReviewSkeleton />
  const is3 = version === '3.0'

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 pt-6 pb-10 sm:pt-8">
      <LargeTitle eyebrow="Flashcard · lặp lại ngắt quãng" title="Ôn tập" aside={words.length > 0 && <div className="flex flex-wrap items-center gap-2">
        {/* The control leads so it lines up with the page's left edge; the count follows it. */}
        <Segmented label="Cách ôn" value={mode} onChange={setMode}
          options={[{ value: 'due', label: 'Đến hạn' }, { value: 'all', label: 'Xem tất cả' }]} />
        <Badge tone="tint" className="text-footnote"><AnimatedNumber value={words.length} /> thẻ</Badge>
      </div>}>
        Nhớ cách đọc và nghĩa trước rồi mới lật thẻ, sau đó chọn mức độ nhớ. Thẻ nhớ tốt sẽ quay lại thưa dần, thẻ quên sẽ quay lại sớm.
      </LargeTitle>
      <TipBubble>{words.length > 0
        ? mode === 'due' ? <>Mỗi ngày tối đa {NEW_PER_DAY} từ mới, còn lại là thẻ đến hạn. Đọc to trước khi lật nhé!</> : <>Chế độ xem tự do không tính lịch ôn, cứ lật thoải mái!</>
        : <>Học xong phần Từ mới của một bài là có thẻ để ôn nhé!</>}</TipBubble>

      {words.length === 0 ? (
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
      ) : mode === 'due' ? <ScheduledReview deck={words} onBrowse={() => setMode('all')} /> : <BrowseDeck words={words} />}
    </div>
  )
}
