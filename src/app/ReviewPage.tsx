import { rememberReviewDeck, ReviewSkeleton } from './skeletons'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, ButtonLink, Card, Kbd } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { EASE } from '@/components/ui/motion'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { Segmented } from '@/components/ui/Segmented'
import { ProgressBar } from '@/components/ui/Progress'
import { lessonName } from '@/data/course'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { WordCard } from '@/components/hanzi/WordCard'
import { completedLessonWords } from '@/lib/lessonState'
import { speak } from '@/lib/speech'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { useSettings } from '@/store/settings'
import { shuffle } from '@/lib/shuffle'

export function ReviewPage() {
  useStudyTimer()
  const { loaded, lessonState } = useStudyData()
  const speechRate = useSettings((state) => state.speechRate)
  const words = useMemo(() => completedLessonWords(lessonState), [lessonState])
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
  }, [words])

  const reshuffle = () => { setOrder(shuffle(words.map((_, i) => i))); setIndex(0); setRevealed(false) }
  const inOrder = () => { setOrder(null); setIndex(0); setRevealed(false) }

  // Which way the last move went, so the next card slides in from that side.
  const direction = useRef(1)
  const move = useCallback((offset: number) => {
    if (!deck.length) return
    direction.current = offset
    setIndex((current) => (current + offset + deck.length) % deck.length)
    setRevealed(false)
  }, [deck.length])

  useEffect(() => {
    if (!deck.length) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target
      if (target instanceof HTMLElement && target.matches('input, textarea, select, [contenteditable="true"]')) return
      if (target instanceof HTMLElement && target.matches('button, a, [role="button"]') && (event.code === 'Space' || event.key === ' ' || event.key === 'Enter')) return
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault()
        setRevealed((value) => !value)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        void speak(deck[index].word.hanzi, speechRate)
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
  }, [deck, index, move, speechRate])

  if (!loaded) return <ReviewSkeleton />
  const current = deck[index]

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 pt-6 pb-10 sm:pt-8">
      <PageHeader eyebrow="Flashcard" title="Ôn tập" aside={deck.length > 0 && <div className="flex flex-wrap items-center gap-2">
        <Badge tone="jade" className="text-sm">{deck.length} thẻ</Badge>
        <Segmented label="Thứ tự thẻ" value={order ? 'shuffle' : 'lesson'} onChange={(v) => (v === 'lesson' ? inOrder() : reshuffle())}
          options={[{ value: 'lesson', label: 'Theo bài' }, { value: 'shuffle', label: '⤨ Trộn ngẫu nhiên' }]} />
        {order && <Button variant="ghost" size="sm" onClick={reshuffle}>Trộn lại</Button>}
      </div>}>
        Từ mới trong các bài bạn đã hoàn thành. Nhớ cách đọc và nghĩa trước, rồi mới lật thẻ.
      </PageHeader>

      {deck.length === 0 ? (
        <Card raised className="p-8 text-center sm:p-10">
          <span className="font-han mx-auto grid size-20 place-items-center rounded-full bg-jade-soft text-4xl text-jade" aria-hidden="true">词</span>
          <h2 className="mt-4 text-xl font-semibold">Chưa có flashcard</h2>
          <p className="mx-auto mt-2 max-w-md leading-relaxed text-muted">Hoàn thành tất cả các phần của một bài, từ mới của bài đó sẽ thành thẻ ôn ở đây.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/lesson" size="lg">Đến bài học →</ButtonLink>
            <ButtonLink to="/pronunciation?tab=tones" variant="secondary" size="lg">Luyện thanh điệu</ButtonLink>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <ProgressBar value={(index + 1) / deck.length} className="h-1.5 flex-1" />
            <span className="shrink-0 text-sm text-muted tabular-nums">{index + 1}/{deck.length}</span>
          </div>
          <motion.div key={`${index}:${current.word.id}`} initial={{ opacity: 0, x: direction.current * 36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: EASE }}
            className="h-[340px] [perspective:1200px] sm:h-[380px]">
            <div className={`relative h-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] motion-reduce:transition-none ${revealed ? '[transform:rotateY(180deg)]' : ''}`}>
              <Card raised aria-hidden={revealed} className="absolute inset-0 flex flex-col overflow-hidden p-5 [backface-visibility:hidden] sm:p-6">
                <div className="flex shrink-0 items-center justify-between gap-3 text-sm text-muted">
                  <Badge>{lessonName(current.lesson)}</Badge>
                  <span className="truncate">{current.lesson.titleVi.replace(/ · \d+ từ mới$/, '')}</span>
                </div>
                <button type="button" onClick={() => setRevealed(true)} className="flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center text-center" aria-label="Lật thẻ">
                  <span lang="zh-CN" className="font-han text-6xl leading-tight sm:text-7xl">{current.word.hanzi}</span>
                  <span className="mt-5 text-sm text-muted">Chạm để lật thẻ</span>
                </button>
                <div className="flex justify-center"><SpeakButton text={current.word.hanzi} size="md" /></div>
              </Card>
              <Card raised aria-hidden={!revealed} className="absolute inset-0 flex flex-col overflow-hidden p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-6">
                <div className="flex shrink-0 items-center justify-between gap-3 text-sm text-muted">
                  <Badge>{lessonName(current.lesson)}</Badge>
                  <span className="truncate">{current.lesson.titleVi.replace(/ · \d+ từ mới$/, '')}</span>
                </div>
                <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
                  <WordCard word={current.word} compact />
                </div>
              </Card>
            </div>
          </motion.div>

          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <Button variant="secondary" size="lg" onClick={() => move(-1)} disabled={deck.length < 2} aria-label="Thẻ trước">←</Button>
            {!revealed ? <Button size="lg" onClick={() => setRevealed(true)}>Lật thẻ</Button>
              : <Button variant="secondary" size="lg" onClick={() => setRevealed(false)}>Úp thẻ</Button>}
            <Button variant="secondary" size="lg" onClick={() => move(1)} disabled={deck.length < 2} aria-label="Thẻ tiếp">→</Button>
          </div>
          <p className="hidden text-center text-xs text-muted sm:block"><Kbd>Space</Kbd> lật thẻ <span className="mx-1">·</span> <Kbd>Enter</Kbd> nghe phát âm <span className="mx-1">·</span> <Kbd>←</Kbd> <Kbd>→</Kbd> chuyển từ</p>
        </>
      )}
    </div>
  )
}
