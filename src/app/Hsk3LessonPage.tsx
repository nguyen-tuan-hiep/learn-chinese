import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '@/lib/db'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { Button, ButtonLink, Card } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/Progress'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { NEW_HSK_BOOK_LESSONS, newHskBookLesson, bookWordProgressId } from '@/data/newHskCourse'

export function Hsk3LessonPage() {
  useStudyTimer()
  const { id = '' } = useParams()
  const lesson = newHskBookLesson(id)
  const { lessonState, loaded } = useStudyData()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [showPinyin, setShowPinyin] = useState(true)

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
    <Card className="border-jade/25 bg-jade-soft/50 p-4 text-sm text-muted">Danh sách từ theo bài trong CSV bạn cung cấp. Bạn có thể học bài khóa, ngữ pháp và bài tập cùng bản PDF của giáo trình.</Card>
    <Card raised className="p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Tiến độ từ vựng</h2><p className="text-sm text-muted">Đã đánh dấu nhớ {learned}/{lesson.words.length} từ{done ? ' · đã học danh sách này' : ''}</p></div><Button variant="secondary" onClick={() => setShowPinyin((value) => !value)} aria-pressed={!showPinyin}>{showPinyin ? 'Ẩn pinyin để tự kiểm tra' : 'Hiện pinyin'}</Button></div><ProgressBar value={lesson.words.length ? learned / lesson.words.length : 0} className="mt-4" /></Card>
    <section aria-labelledby="hsk3-vocab-title"><h2 id="hsk3-vocab-title" className="mb-3 text-xl font-semibold">Từ mới</h2><p className="mb-4 text-sm text-muted">Nghe và đọc từng từ, rồi đánh dấu khi bạn đã nhớ cách đọc. Nghĩa được lấy theo cột tiếng Anh trong CSV.</p>
      {error && <p role="alert" className="mb-3 text-cinnabar">{error}</p>}
      {lesson.words.length === 0 && <Card className="p-5 text-sm text-muted">Bài này chưa có từ được xác minh trong ứng dụng. Bạn có thể học bài tương ứng trong PDF giáo trình và quay lại khi dữ liệu được bổ sung.</Card>}
      <ol className="grid gap-3 sm:grid-cols-2">{lesson.words.map((word) => {
        const remembered = !!lessonState.get(bookWordProgressId(word.id))?.done.vocab
        return <li key={word.id} className="flex min-w-0 items-center gap-3 rounded-2xl border border-line bg-surface p-4"><span className="min-w-0 flex-1"><span lang="zh-CN" className="font-han block text-2xl leading-snug">{word.hanzi}</span>{showPinyin && <span className="block text-sm text-jade">{word.pinyin}</span>}<span className="block text-xs text-muted">{word.meaning}{word.pos ? ` · Từ loại: ${word.pos}` : ''}</span></span><SpeakButton text={word.hanzi} /><button type="button" onClick={() => void save(bookWordProgressId(word.id), !remembered)} disabled={!loaded || busy !== null} aria-pressed={remembered} className={`min-h-11 shrink-0 cursor-pointer rounded-xl border px-3 text-sm font-semibold ${remembered ? 'border-jade bg-jade-soft text-jade' : 'border-line text-muted hover:bg-sunken'}`}>{remembered ? 'Đã nhớ ✓' : 'Đánh dấu nhớ'}</button></li>
      })}</ol>
    </section>
    {lesson.words.length > 0 && <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-4 shadow-card"><p className="text-sm text-muted">{done ? 'Bạn đã học danh sách từ này.' : 'Đánh dấu sau khi học xong các từ đang có.'}</p><Button variant={done ? 'secondary' : 'primary'} disabled={!loaded || busy !== null} onClick={() => void save(lesson.id, !done)}>{done ? 'Bỏ đánh dấu' : 'Đã học các từ này'}</Button></div>}
    <nav aria-label="Điều hướng bài" className="flex justify-end">{next && <ButtonLink to={`/lesson/${next.id}`} variant="secondary">Bài tiếp theo →</ButtonLink>}</nav>
  </div>
}
