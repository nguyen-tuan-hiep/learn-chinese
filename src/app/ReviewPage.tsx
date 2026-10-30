import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui/Button'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { WordCard } from '@/components/hanzi/WordCard'
import { completedLessonWords } from '@/lib/lessonState'
import { speak } from '@/lib/speech'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { useSettings } from '@/store/settings'

export function ReviewPage() {
  useStudyTimer()
  const { loaded, lessonState } = useStudyData()
  const speechRate = useSettings((state) => state.speechRate)
  const deck = useMemo(() => completedLessonWords(lessonState), [lessonState])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(0, deck.length - 1)))
    setRevealed(false)
  }, [deck.length])

  const move = useCallback((offset: number) => {
    if (!deck.length) return
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

  if (!loaded) return <div className="pt-8 text-muted">Đang tải thẻ từ vựng…</div>

  return (
    <div className="mx-auto w-full max-w-xl pt-6 pb-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ôn tập</h1>
          <p className="mt-1 text-sm text-muted">Flashcard từ mới trong các bài bạn đã hoàn thành.</p>
        </div>
        {deck.length > 0 && <span className="shrink-0 text-sm tabular-nums text-muted">{index + 1} / {deck.length}</span>}
      </div>

      {deck.length === 0 ? (
        <Card className="mt-6 p-8 text-center">
          <div className="font-han text-4xl text-jade" aria-hidden="true">词</div>
          <h2 className="mt-3 text-lg font-bold">Chưa có flashcard</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">Khi bạn đánh dấu hoàn thành tất cả các phần của một bài, từ mới trong bài đó sẽ xuất hiện ở đây.</p>
          <Link to="/course"><Button className="mt-5">Đến giáo trình</Button></Link>
        </Card>
      ) : (
        <>
          <div className="mt-5 h-[280px] [perspective:1100px] sm:h-[320px]">
            <div className={`relative h-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d] motion-reduce:transition-none ${revealed ? '[transform:rotateY(180deg)]' : ''}`}>
              <Card aria-hidden={revealed} className="absolute inset-0 flex flex-col overflow-hidden p-4 [backface-visibility:hidden] sm:p-5">
                <div className="flex shrink-0 items-center justify-between gap-3 text-xs text-muted sm:text-sm">
                  <span>{deck[index].lesson.titleVi}</span>
                  <span>HSK {deck[index].lesson.level} · Bài {deck[index].lesson.number}</span>
                </div>
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
                  <div className="font-han text-5xl font-normal leading-tight sm:text-6xl">{deck[index].word.hanzi}</div>
                  <SpeakButton className="mt-4" text={deck[index].word.hanzi} size="md" />
                  <p className="mt-4 text-sm text-muted">Nhớ cách đọc và nghĩa, rồi lật thẻ để xem đáp án.</p>
                </div>
              </Card>
              <Card aria-hidden={!revealed} className="absolute inset-0 flex flex-col overflow-hidden p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-5">
                <div className="flex shrink-0 items-center justify-between gap-3 text-xs text-muted sm:text-sm">
                  <span>{deck[index].lesson.titleVi}</span>
                  <span>HSK {deck[index].lesson.level} · Bài {deck[index].lesson.number}</span>
                </div>
                <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
                  <WordCard word={deck[index].word} compact />
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Button variant="secondary" onClick={() => move(-1)} disabled={deck.length < 2}>Trước</Button>
            {!revealed ? (
              <Button onClick={() => setRevealed(true)}>Lật thẻ</Button>
            ) : (
              <Button variant="secondary" onClick={() => setRevealed(false)}>Úp thẻ</Button>
            )}
            <Button variant="secondary" onClick={() => move(1)} disabled={deck.length < 2}>{'Tiếp'}</Button>
          </div>
          <p className="mt-3 text-center text-xs text-muted"><kbd className="rounded border border-line bg-surface px-1.5 py-0.5">Space</kbd> lật thẻ <span className="mx-1">·</span> <kbd className="rounded border border-line bg-surface px-1.5 py-0.5">Enter</kbd> nghe phát âm <span className="mx-1">·</span> <kbd className="rounded border border-line bg-surface px-1.5 py-0.5">←</kbd> <kbd className="rounded border border-line bg-surface px-1.5 py-0.5">→</kbd> chuyển từ</p>
        </>
      )}
    </div>
  )
}
