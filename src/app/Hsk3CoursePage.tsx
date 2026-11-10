import { Link, useSearchParams } from 'react-router-dom'
import { useStudyData } from '@/lib/useStudyData'
import { useSettings } from '@/store/settings'
import { Segmented } from '@/components/ui/Segmented'
import { ProgressBar } from '@/components/ui/Progress'
import { NEW_HSK_BOOK_LESSONS, NEW_HSK_COURSE, bookWordProgressId } from '@/data/newHskCourse'

export function Hsk3CoursePage() {
  const [params, setParams] = useSearchParams()
  const { lessonState } = useStudyData()
  const setSettings = useSettings((s) => s.set)
  const requested = Number(params.get('level'))
  const level = NEW_HSK_COURSE.some((book) => book.level === requested) ? requested : 1

  return <div className="mx-auto max-w-4xl space-y-6 pt-6 pb-12 sm:pt-8">
    <header className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-jade">Giáo trình FLTRP · HSK 3.0</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">New HSK Course · 新HSK教程</h1>
      <p className="max-w-2xl text-muted">Học theo 68 bài của bộ New HSK Course HSK 1–4. Từ vựng mỗi bài có chữ Hán, pinyin, từ loại và nghĩa tiếng Anh.</p>
      <Segmented label="Phiên bản HSK" value="3.0" onChange={(v) => { if (v === '2.0') setSettings({ hskVersion: '2.0' }) }} options={[{ value: '2.0', label: 'HSK 2.0' }, { value: '3.0', label: 'HSK 3.0' }]} />
    </header>
    <Segmented label="Cấp giáo trình" value={String(level)} onChange={(v) => setParams({ level: v })} options={NEW_HSK_COURSE.map((book) => ({ value: String(book.level), label: `HSK ${book.level}` }))} />
    {NEW_HSK_COURSE.filter((book) => book.level === level).map((book) => <section key={book.level} aria-labelledby={`new-hsk-book-${book.level}`} className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 id={`new-hsk-book-${book.level}`} className="text-xl font-semibold">New HSK Course {book.level}{book.level === 4 ? ' · 4A & 4B' : ''}</h2>{book.source && <a href={book.source} target="_blank" rel="noreferrer" className="text-sm text-jade underline">Xem mục lục nguồn ↗</a>}</div>
      <ol className="grid gap-3 sm:grid-cols-2">{book.titles.map((title, index) => {
        const lesson = NEW_HSK_BOOK_LESSONS.find((item) => item.band === book.level && item.number === index + 1)
        const learned = lesson?.words.filter((word) => lessonState.get(bookWordProgressId(word.id))?.done.vocab).length ?? 0
        return <li key={title}><Link to={`/lesson/${lesson?.id}`} className="block h-full rounded-2xl border border-line bg-surface p-4 transition hover:border-jade/40 hover:shadow-card focus-visible:outline-2 focus-visible:outline-jade"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-sunken text-sm font-semibold tabular-nums">{index + 1}</span><div className="min-w-0"><h3 lang="zh-CN" className="font-han text-lg leading-snug">{title}</h3><p className="mt-2 text-sm text-muted">{lesson?.words.length ? `${lesson.words.length} từ · đã nhớ ${learned}` : 'Chưa có từ vựng'}</p></div></div>{!!lesson?.words.length && <ProgressBar value={learned / lesson.words.length} className="mt-3 h-1.5" />}</Link></li>
      })}</ol>
    </section>)}
    <p className="text-sm text-muted">Nguồn từ vựng: CSV bạn cung cấp. Bài khóa, ngữ pháp và bài tập chưa được đưa vào ứng dụng.</p>
  </div>
}
