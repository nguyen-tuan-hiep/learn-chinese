import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '@/lib/db'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { Button, ButtonLink, Card } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/Progress'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { Badge } from '@/components/ui/Badge'
import { StrokeOrderGuide } from '@/components/hanzi/StrokeOrder'
import { Sheet } from '@/components/ui/Sheet'
import { NEW_HSK_BOOK_LESSONS, newHskBookLesson, bookWordProgressId } from '@/data/newHskCourse'

type BookWord = NonNullable<ReturnType<typeof newHskBookLesson>>['words'][number]

function PenIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" />
  </svg>
}

/** One vocabulary card: the word and its sound on top, the meaning, then the actions in a footer. */
function WordCard({ word, showPinyin, remembered, disabled, onToggle, onWrite }: {
  word: BookWord; showPinyin: boolean; remembered: boolean; disabled: boolean; onToggle: () => void; onWrite: () => void
}) {
  return <li className={`flex min-w-0 flex-col rounded-2xl border p-4 transition-colors ${remembered ? 'border-jade/40 bg-jade-soft/40' : 'border-line bg-surface'}`}>
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <p lang="zh-CN" className="font-han text-3xl leading-tight">{word.hanzi}</p>
        {/* Keeps its line when hidden, so cards don't change height. */}
        <p className={`mt-0.5 min-h-6 ${showPinyin ? '' : 'invisible'}`}><Pinyin text={word.pinyin} className="text-base" /></p>
      </div>
      <SpeakButton text={word.hanzi} />
    </div>
    <p className="mt-2 mb-3 text-sm leading-relaxed">
      {word.meaning}
      {word.pos && <Badge className="ml-2 align-[1px]">{word.pos}</Badge>}
    </p>
    <div className="mt-auto flex items-center justify-between gap-2 border-t border-line/70 pt-3">
      <button type="button" onClick={onWrite} aria-label={`Cách viết ${word.hanzi}`}
        className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg px-2 -ml-2 text-sm font-semibold text-jade hover:bg-jade-soft">
        <PenIcon />Cách viết
      </button>
      <button type="button" onClick={onToggle} disabled={disabled} aria-pressed={remembered}
        className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors disabled:cursor-wait ${remembered ? 'bg-jade text-white dark:text-paper' : 'border border-line text-muted hover:border-jade/50 hover:text-ink'}`}>
        {remembered ? <><span aria-hidden="true">✓</span>Đã nhớ</> : 'Đánh dấu nhớ'}
      </button>
    </div>
  </li>
}

export function Hsk3LessonPage() {
  useStudyTimer()
  const { id = '' } = useParams()
  const lesson = newHskBookLesson(id)
  const { lessonState, loaded } = useStudyData()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [showPinyin, setShowPinyin] = useState(true)
  // The word whose stroke order is open, by id.
  const [writing, setWriting] = useState<number | null>(null)
  const closeWriting = useCallback(() => setWriting(null), [])

  if (!lesson) return <div className="pt-8"><p>Không tìm thấy bài học HSK 3.0.</p><Link to="/lesson" className="text-jade underline">Về danh sách bài</Link></div>

  const learned = lesson.words.filter((word) => lessonState.get(bookWordProgressId(word.id))?.done.vocab).length
  const done = !!lessonState.get(lesson.id)?.done.vocab
  const next = NEW_HSK_BOOK_LESSONS[NEW_HSK_BOOK_LESSONS.findIndex((item) => item.id === lesson.id) + 1]
  const bandLabel = `HSK ${lesson.band}`
  const save = async (key: string, complete: boolean) => {
    setBusy(key); setError('')
    try { await db.lessonState.put({ lessonId: key, done: complete ? { vocab: Date.now() } : {} }) }
    catch { setError('Chưa lưu được tiến độ. Hãy thử lại.') }
    finally { setBusy(null) }
  }

  return <div className="mx-auto max-w-4xl space-y-6 pt-5 pb-12 sm:pt-8">
    <header className="flex items-start gap-3">
      <Link to={`/lesson?level=${lesson.band}`} aria-label="Về danh sách bài" className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface">←</Link>
      <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-widest text-jade">HSK 3.0 · {bandLabel} · New HSK Course · FLTRP</p><h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Bài {lesson.number}: {lesson.title}</h1><p className="mt-1 text-sm text-muted">{lesson.words.length} mục từ · nghĩa tiếng Anh</p></div>
    </header>

    <Card raised className="p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Tiến độ từ vựng</h2><p className="text-sm text-muted">Đã đánh dấu nhớ {learned}/{lesson.words.length} từ{done ? ' · đã học danh sách này' : ''}</p></div><Button variant="secondary" onClick={() => setShowPinyin((value) => !value)} aria-pressed={!showPinyin}>{showPinyin ? 'Ẩn pinyin để tự kiểm tra' : 'Hiện pinyin'}</Button></div><ProgressBar value={lesson.words.length ? learned / lesson.words.length : 0} className="mt-4" /></Card>
    <section aria-labelledby="hsk3-vocab-title"><h2 id="hsk3-vocab-title" className="mb-3 text-xl font-semibold">Từ mới</h2><p className="mb-4 text-sm text-muted">Nghe và đọc từng từ, rồi đánh dấu khi bạn đã nhớ cách đọc. Nghĩa được lấy theo cột tiếng Anh trong CSV.</p>
      {error && <p role="alert" className="mb-3 text-cinnabar">{error}</p>}
      {lesson.words.length === 0 && <Card className="p-5 text-sm text-muted">Bài này chưa có từ được xác minh trong ứng dụng. Bạn có thể học bài tương ứng trong PDF giáo trình và quay lại khi dữ liệu được bổ sung.</Card>}
      <ol className="grid gap-3 sm:grid-cols-2">{lesson.words.map((word) => {
        const progressId = bookWordProgressId(word.id)
        const remembered = !!lessonState.get(progressId)?.done.vocab
        return <WordCard key={word.id} word={word} showPinyin={showPinyin} remembered={remembered} disabled={!loaded || busy !== null}
          onToggle={() => void save(progressId, !remembered)} onWrite={() => setWriting(word.id)} />
      })}</ol>
    </section>
    {lesson.words.length > 0 && <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-4 shadow-card"><p className="text-sm text-muted">{done ? 'Bạn đã học danh sách từ này.' : 'Đánh dấu sau khi học xong các từ đang có.'}</p><Button variant={done ? 'secondary' : 'primary'} disabled={!loaded || busy !== null} onClick={() => void save(lesson.id, !done)}>{done ? 'Bỏ đánh dấu' : 'Đã học các từ này'}</Button></div>}
    {(() => {
      const word = lesson.words.find((item) => item.id === writing)
      return <Sheet open={!!word} onClose={closeWriting} label={word ? `Cách viết ${word.hanzi}` : 'Cách viết'}>
        {word && <StrokeOrderGuide key={word.id} hanzi={word.hanzi} pinyin={word.pinyin} meaning={word.meaning} onClose={closeWriting} />}
      </Sheet>
    })()}
    <nav aria-label="Điều hướng bài" className="flex justify-end">{next && <ButtonLink to={`/lesson/${next.id}`} variant="secondary">Bài tiếp theo →</ButtonLink>}</nav>
  </div>
}
