import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { db } from '@/lib/db'
import { useParams } from 'react-router-dom'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { ButtonLink, Card } from '@/components/ui/Button'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Badge } from '@/components/ui/Badge'
import { Hint } from '@/components/ui/Disclosure'
import { Glass } from '@/components/ui/Glass'
import { ProgressBar } from '@/components/ui/Progress'
import { Rise, Stagger, spring } from '@/components/ui/motion'
import { Sheet } from '@/components/ui/Sheet'
import { WordCard } from '@/components/hanzi/WordCard'
import { StrokeOrderGuide } from '@/components/hanzi/StrokeOrder'
import { LessonHeader } from '@/components/lesson/LessonHeader'
import { LessonFinishBar } from '@/components/lesson/LessonFinishBar'
import { LessonSkeleton } from '@/components/lesson/LessonSkeleton'
import { NEW_HSK_BOOK_LESSONS, newHskBookLesson, bookWordProgressId } from '@/data/newHskCourse'

/** iOS-style switch row; `on` means pinyin is hidden. */
function HidePinyinSwitch({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
    className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 text-left">
    <span className="text-subhead">Ẩn pinyin để tự kiểm tra</span>
    <span className={`flex h-[1.9375rem] w-[3.1875rem] shrink-0 items-center rounded-full p-0.5 transition-colors ${on ? 'bg-success justify-end' : 'bg-fill justify-start'}`}>
      <motion.span layout transition={spring.snappy} className="size-[1.6875rem] rounded-full bg-white shadow-card" />
    </span>
  </button>
}

/** HSK 3.0 lesson: header, progress panel, grid of word cards, sticky finish bar. */
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

  if (!lesson) return <Card className="mx-auto mt-10 max-w-3xl p-6 text-center"><p className="text-headline">Không tìm thấy bài học HSK 3.0</p><ButtonLink to="/lesson" className="mt-4">Về danh sách bài</ButtonLink></Card>
  if (!loaded) return <LessonSkeleton book={lesson} version="3.0" />

  const total = lesson.words.length
  const learned = lesson.words.filter((word) => lessonState.get(bookWordProgressId(word.id))?.done.vocab).length
  const done = !!lessonState.get(lesson.id)?.done.vocab
  const next = NEW_HSK_BOOK_LESSONS[NEW_HSK_BOOK_LESSONS.findIndex((item) => item.id === lesson.id) + 1]
  const save = async (key: string, complete: boolean) => {
    setBusy(key); setError('')
    try { await db.lessonState.put({ lessonId: key, done: complete ? { vocab: Date.now() } : {} }) }
    catch { setError('Chưa lưu được tiến độ. Hãy thử lại.') }
    finally { setBusy(null) }
  }
  const writingWord = lesson.words.find((item) => item.id === writing)

  return <div className="mx-auto w-full max-w-3xl min-w-0 pt-5 sm:pt-7">
    <LessonHeader book={lesson} />

    <Glass className="mt-6 p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-footnote font-medium text-secondary-label">Tiến độ từ vựng</p>
          <p className="text-title1 leading-tight"><AnimatedNumber value={learned} /><span className="text-title3 text-secondary-label">/{total} từ</span></p>
        </div>
        {done && <Badge tone="success">Đã học danh sách này</Badge>}
      </div>
      <ProgressBar tone="gradient" value={total ? learned / total : 0} className="mt-3" />
      <div className="mt-2 border-t border-separator pt-1"><HidePinyinSwitch on={!showPinyin} onChange={(on) => setShowPinyin(!on)} /></div>
    </Glass>

    <section aria-labelledby="hsk3-vocab-title" className="mt-6">
      <h2 id="hsk3-vocab-title" className="mb-3 text-title3">Từ mới</h2>
      <Hint>Nghe và đọc từng từ, rồi đánh dấu khi bạn đã nhớ cách đọc. Nghĩa được lấy theo cột tiếng Anh trong CSV.</Hint>
      {error && <p role="alert" className="mt-3 text-subhead text-danger">{error}</p>}
      {total === 0 ? <Card className="mt-4 p-5 text-subhead text-secondary-label">Bài này chưa có từ được xác minh trong ứng dụng. Bạn có thể học bài tương ứng trong PDF giáo trình và quay lại khi dữ liệu được bổ sung.</Card>
        : <Stagger gap={0.04} role="list" className="mt-4 grid gap-3 sm:grid-cols-2">{lesson.words.map((word) => {
          const progressId = bookWordProgressId(word.id)
          const remembered = !!lessonState.get(progressId)?.done.vocab
          return <Rise key={word.id} role="listitem" className="min-w-0">
            <WordCard variant="row" word={word} showPinyin={showPinyin} remembered={remembered} disabled={busy !== null}
              onToggle={() => void save(progressId, !remembered)} onWrite={() => setWriting(word.id)} />
          </Rise>
        })}</Stagger>}
    </section>

    {total > 0 && <LessonFinishBar
      done={done} disabled={busy !== null}
      status={<><b className="font-semibold text-label">{learned}/{total}</b> từ đã nhớ</>}
      label={done ? 'Bỏ đánh dấu' : 'Đã học các từ này'}
      onClick={() => void save(lesson.id, !done)} />}

    <nav aria-label="Điều hướng bài" className="mt-6 flex justify-end pb-2">{next && <ButtonLink to={`/lesson/${next.id}`} variant="secondary">Bài tiếp theo →</ButtonLink>}</nav>

    <Sheet open={!!writingWord} onClose={closeWriting} label={writingWord ? `Cách viết ${writingWord.hanzi}` : 'Cách viết'}>
      {writingWord && <StrokeOrderGuide key={writingWord.id} hanzi={writingWord.hanzi} pinyin={writingWord.pinyin} meaning={writingWord.meaning} onClose={closeWriting} />}
    </Sheet>
  </div>
}
