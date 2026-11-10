import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NEW_HSK_BOOK_LESSONS, bookWordProgressId } from '@/data/newHskCourse'
import { useStudyData } from '@/lib/useStudyData'
import { Button, Card } from '@/components/ui/Button'
import { SpeakButton } from '@/components/hanzi/SpeakButton'

export function Hsk3ReviewPage() {
  const { lessonState } = useStudyData()
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const words = NEW_HSK_BOOK_LESSONS.flatMap((lesson) => lesson.words)
    .filter((word) => lessonState.get(bookWordProgressId(word.id))?.done.vocab)
  const current = words[Math.min(index, words.length - 1)]
  const move = (direction: number) => { setIndex((i) => (i + direction + words.length) % words.length); setRevealed(false) }
  return <div className="mx-auto max-w-2xl space-y-6 pt-6 pb-12 sm:pt-8">
    <header>
      <p className="text-xs font-semibold uppercase tracking-widest text-jade">HSK 3.0 · New HSK Course</p>
      <h1 className="mt-2 text-3xl font-semibold">Ôn từ đã đánh dấu</h1>
      <p className="mt-2 text-muted">Nhìn chữ Hán, thử nhớ cách đọc rồi lật thẻ. <Link to="/lesson" className="text-jade underline">Xem danh sách từ →</Link></p>
    </header>
    {!current ? <Card raised className="p-8 text-center"><p>Chưa có từ đã đánh dấu nhớ.</p><Link to="/lesson" className="mt-3 inline-block font-semibold text-jade underline">Bắt đầu học từ vựng →</Link></Card> : <>
      <p className="text-sm tabular-nums text-muted">Thẻ {index + 1}/{words.length}</p>
      <Card raised className="flex min-h-72 flex-col items-center justify-center gap-5 p-8 text-center">
        <span lang="zh-CN" className="font-han text-6xl">{current.hanzi}</span>
        {revealed ? <div><p className="text-xl text-jade">{current.pinyin}</p><p className="mt-2 text-sm text-muted">{current.meaning}{current.pos ? ` · Từ loại: ${current.pos}` : ''}</p></div> : <p className="text-sm text-muted">Thử đọc trước khi lật thẻ</p>}
        <SpeakButton text={current.hanzi} />
      </Card>
      <div className="grid grid-cols-[auto_1fr_auto] gap-3">
        <Button variant="secondary" onClick={() => move(-1)} aria-label="Thẻ trước">←</Button>
        <Button onClick={() => setRevealed((value) => !value)}>{revealed ? 'Úp thẻ' : 'Lật thẻ'}</Button>
        <Button variant="secondary" onClick={() => move(1)} aria-label="Thẻ tiếp">→</Button>
      </div>
    </>}
  </div>
}
