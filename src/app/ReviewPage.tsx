import { cheer } from '@/store/mascot'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookOpenCheck, X } from 'lucide-react'
import { Button, ButtonLink, Kbd } from '@/components/ui/Button'
import { LargeTitle } from '@/components/ui/PageHeader'
import { BrandMark } from '@/components/layout/BrandMark'
import { Segmented } from '@/components/ui/Segmented'
import { ProgressBar } from '@/components/ui/Progress'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { FlashCard } from '@/components/review/FlashCard'
import { ReviewControls } from '@/components/review/ReviewControls'
import { CustomStudySheet } from '@/components/review/CustomStudy'
import { ReviewSkeleton, rememberReviewDeck } from '@/components/review/ReviewSkeleton'
import { RatingBar, formatInterval } from '@/components/srs/RatingBar'
import { useCourse, type ReviewWord } from '@/lib/courseModel'
import { useStudyData } from '@/lib/useStudyData'
import { buildQueue } from '@/lib/reviewQueue'
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
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-[var(--glass-regular)] px-3 py-1.5 text-footnote font-semibold shadow-card">
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
  const newCardsPerDay = useSettings((state) => state.newCardsPerDay)
  const learnAheadMinutes = useSettings((state) => state.learnAheadMinutes)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { setNow(new Date()) }, [dataNow])
  const [graded, setGraded] = useState<Map<string, StoredCard>>(() => new Map())
  const [extraNew, setExtraNew] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [answersThisSession, setAnswersThisSession] = useState(0)
  const queue = useMemo(() => buildQueue(deck, cards, reviews, now, { extraNew, graded, newCardsPerDay, learnAheadMinutes }), [deck, cards, reviews, now, extraNew, graded, newCardsPerDay, learnAheadMinutes])

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
      if (g === 1) cheer('sad'); else if (g >= 3) cheer('happy')
      notify({ icon: 'check', text: item.word.hanzi, zh: true, sub: `back in ${formatInterval(next.dueAt.getTime() - at.getTime())}` })
      setGraded((m) => new Map(m).set(next.id, next))
      last.current = item.word.id
      held.current = null
      setRevealed(false)
      setAnswersThisSession((n) => n + 1)
      setNow(new Date())
    } catch {
      setError('Could not save your answer. Please try again.')
    } finally {
      setBusy(false)
    }
  }, [item, busy])

  const { counts } = queue
  const left = counts.fresh + counts.learning + counts.review

  if (!item) return <section style={{ '--tint': 'var(--pastel-green)', '--sun': '120% 75% at 50% 130%' } as CSSProperties} className="on-light glass-card glow-tiles relative overflow-hidden rounded-[2.25rem] p-8 text-center sm:p-10">
    <BrandMark live className="mx-auto size-24" />
    <h2 className="mt-4 font-display text-title2 font-black">{answersThisSession > 0 ? 'All caught up for now!' : 'No cards due'}</h2>
    <p className="mx-auto mt-2 max-w-md text-callout text-secondary-label text-pretty">
      {answersThisSession > 0 && <>You gave <b className="text-label">{answersThisSession}</b> answer{answersThisSession === 1 ? '' : 's'} this session. </>}
      {queue.nextDue ? <>The next card is due in {formatInterval(queue.nextDue.getTime() - now.getTime())}. </> : null}
      Reviewing cards right when they fall due keeps words fresh without wasting time.
    </p>
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {queue.moreNew > 0 && <Button size="lg" onClick={() => setExtraNew((n) => n + 10)}>Learn {Math.min(10, queue.moreNew)} more new words</Button>}
      <Button size="lg" variant="secondary" onClick={onBrowse}>Custom study</Button>
    </div>
  </section>

  return <>
    <div className="flex flex-wrap items-center gap-2">
      <CountPill label="New" value={counts.fresh} dot="var(--color-feature-pronunciation)" />
      <CountPill label="Learning" value={counts.learning} dot="var(--color-streak)" />
      <CountPill label="Due" value={counts.review} dot="var(--color-success)" />
      {answersThisSession > 0 && <span className="ml-auto text-footnote text-secondary-label tabular-nums">{answersThisSession} answer{answersThisSession === 1 ? '' : 's'} · {left} card{left === 1 ? '' : 's'} left</span>}
    </div>
    <FlashCard card={item.word} revealed={revealed} direction={1} isNew={item.isNew} onFlip={flip} />
    <p role="status" aria-live="polite" className="sr-only">{revealed ? `Back: ${item.word.pinyin}, ${item.word.meaning}. Rate how well you remembered.` : `Front: ${item.word.hanzi}`}</p>
    {/* Phones: the controls ride just above the tab bar, so a tall card never pushes them under it. */}
    <div className="max-md:sticky max-md:bottom-[calc(5.5rem+env(safe-area-inset-bottom))] max-md:z-10">
      {revealed
        ? <RatingBar card={item.card} onRate={(g) => void rate(g)} disabled={busy} />
        : <div className="flex justify-center"><Button size="lg" onClick={flip} className="min-w-56">Show answer</Button></div>}
    </div>
    {error && <p role="alert" className="text-center text-footnote text-danger">{error}</p>}
    <p className="hidden text-center text-caption text-secondary-label sm:block">
      <Kbd>Space</Kbd> flip <span className="mx-1">·</span> <Kbd>1</Kbd>–<Kbd>4</Kbd> Again / Hard / Good / Easy <span className="mx-1">·</span> <Kbd>Enter</Kbd> listen
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
      <Segmented label="Card order" value={order ? 'shuffle' : 'lesson'} onChange={(v) => (v === 'lesson' ? inOrder() : reshuffle())}
        options={[{ value: 'lesson', label: 'By lesson' }, { value: 'shuffle', label: 'Shuffled' }]} />
      {order && <Button variant="ghost" size="sm" onClick={reshuffle}>Shuffle again</Button>}
    </div>
    <div className="flex items-center gap-3">
      <ProgressBar tone="gradient" value={(index + 1) / deck.length} className="h-1.5 flex-1" />
      <span className="shrink-0 text-subhead text-secondary-label tabular-nums"><AnimatedNumber value={index + 1} />/{deck.length}</span>
    </div>
    <FlashCard card={current} revealed={revealed} direction={direction} onFlip={flip} />
    <p role="status" aria-live="polite" className="sr-only">{revealed ? `Back: ${current.pinyin}, ${current.meaning}` : `Front: ${current.hanzi}`}</p>
    <ReviewControls revealed={revealed} canMove={deck.length > 1} onPrev={() => move(-1)} onNext={() => move(1)} onFlip={flip} />
  </>
}

/** Flashcard review for HSK 2.0 and 3.0: today's FSRS queue; "Custom study" flips through one lesson's remembered words, or all of them, off the schedule. */
export function ReviewPage() {
  useStudyTimer()
  const { loaded, reviewDeck: allWords, version, levels } = useCourse()
  const newCardsPerDay = useSettings((state) => state.newCardsPerDay)
  const [params, setParams] = useSearchParams()
  // `?mode=all` is custom study, `&lesson=<id>` narrows it to one lesson (ignored when that lesson has no remembered words, e.g. after switching version).
  const mode: Mode = params.get('mode') === 'all' ? 'all' : 'due'
  const lessonParam = params.get('lesson')
  const lesson = lessonParam && allWords.some((w) => w.lessonId === lessonParam) ? lessonParam : null
  const words = useMemo(() => (mode === 'all' && lesson ? allWords.filter((w) => w.lessonId === lesson) : allWords), [allWords, lesson, mode])
  const [picking, setPicking] = useState(false)
  const closePicker = useCallback(() => setPicking(false), [])
  const startCustom = (lessonId: string | null) => { setParams({ mode: 'all', ...(lessonId ? { lesson: lessonId } : {}) }, { replace: true }); setPicking(false) }
  const endCustom = () => setParams({}, { replace: true })
  useEffect(() => { if (loaded) rememberReviewDeck(allWords.length > 0) }, [loaded, allWords.length])

  if (!loaded) return <ReviewSkeleton />
  const is3 = version === '3.0'
  const lessonName = lesson ? allWords.find((w) => w.lessonId === lesson)?.lessonLabel : null

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 pt-6 pb-10 sm:pt-8">
      <LargeTitle eyebrow="Flashcards · spaced repetition" title="Review" aside={allWords.length > 0 && mode === 'due' &&
        // One control: the known-word count rides inside the button as a counter, not as a second pill that looks clickable.
        <Button variant="secondary" onClick={() => setPicking(true)} aria-label={`Custom study, ${allWords.length} known word${allWords.length === 1 ? '' : 's'}`}>
          <BookOpenCheck aria-hidden="true" className="size-4" />Custom study
          <span aria-hidden="true" className="-mr-1 grid h-6 min-w-6 place-items-center rounded-full bg-fill px-2 text-caption font-bold tabular-nums text-secondary-label"><AnimatedNumber value={allWords.length} /></span>
        </Button>} />
      {mode === 'all' && allWords.length > 0
        ? <div className="glass flex items-center gap-3 rounded-[1.75rem]! py-2.5 pr-2.5 pl-4 [corner-shape:round]!">
          <span style={{ '--tint': 'var(--pastel-lilac)' } as CSSProperties} className="glass glass-tint on-pastel grid size-9 shrink-0 place-items-center rounded-full text-label"><BookOpenCheck aria-hidden="true" className="size-4.5" /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-caption font-semibold text-secondary-label">Custom study · {words.length} words</span>
            <span className="block truncate text-callout font-semibold">{lessonName ?? 'All known words'}</span>
          </span>
          <Button variant="secondary" size="sm" onClick={() => setPicking(true)}>Change</Button>
          <Button variant="ghost" size="sm" onClick={endCustom} aria-label="End custom study"><X aria-hidden="true" className="size-4" /></Button>
        </div>
        : allWords.length > 0 && <p className="-mt-3 text-subhead text-secondary-label">Up to {newCardsPerDay} new words a day, plus whatever is due. To drill one lesson, use Custom study.</p>}

      {words.length === 0 ? (
        <section style={{ '--tint': 'var(--pastel-blue)', '--sun': '120% 75% at 50% 130%' } as CSSProperties} className="on-light glass-card glow-tiles relative overflow-hidden rounded-[2.25rem] p-8 text-center sm:p-10">
          <BrandMark live className="mx-auto size-24" />
          <h2 className="mt-4 text-title3">No flashcards yet</h2>
          <p className="mx-auto mt-2 max-w-md text-callout text-secondary-label text-pretty">
            {is3 ? 'Mark words as “Known” in an HSK 3.0 lesson and they will show up here.'
              : 'Finish the new words of a lesson and they become review cards here.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/lesson" size="lg">Go to lessons</ButtonLink>
            {!is3 && <ButtonLink to="/pronunciation?tab=tones" variant="secondary" size="lg">Practise tones</ButtonLink>}
          </div>
        </section>
      ) : mode === 'due' ? <ScheduledReview deck={words} onBrowse={() => setPicking(true)} /> : <BrowseDeck key={lesson ?? 'all'} words={words} />}
      <CustomStudySheet open={picking} onClose={closePicker} levels={levels} words={allWords} value={mode === 'all' ? lesson : undefined} onPick={startCustom} />
    </div>
  )
}
