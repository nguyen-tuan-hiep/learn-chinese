import { useParams, useSearchParams, Link } from 'react-router-dom'
import { findCourseLesson } from '@/data/course'
import type { LessonPart } from '@/lib/db'
import { markPart, PARTS } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { VocabPart } from '@/components/lesson/VocabPart'
import { GrammarPart } from '@/components/lesson/GrammarPart'
import { DialoguePart } from '@/components/lesson/DialoguePart'
import { WritingPart } from '@/components/lesson/WritingPart'

export function LessonPage() {
  useStudyTimer()
  const { id = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const lesson = findCourseLesson(id)
  const { loaded, lessonState, newWordsToday } = useStudyData()

  if (!loaded) return <p role="status" className="pt-8">Đang tải tiến độ…</p>

  if (!lesson) return <p className="pt-10">Không tìm thấy bài học.</p>

  const done = lessonState.get(lesson.id)?.done ?? {}
  const requested = params.get('part')
  const part = PARTS.find((p) => p.id === requested)?.id ?? PARTS.find((p) => !done[p.id])?.id ?? 'vocab'
  const complete = (p: LessonPart) => markPart(lesson.id, p)

  return (
    <div className="max-w-3xl pt-6">
      <Link to="/course" className="text-sm text-muted hover:text-ink">
        ← Giáo trình HSK {lesson.level}
      </Link>
      <div className="mt-3 flex items-baseline gap-4 flex-wrap">
        <span className="text-sm font-bold text-muted">Bài {lesson.number}</span>
        <h1 className="font-han text-3xl sm:text-4xl font-semibold">{lesson.title}</h1>
      </div>
      <div className="mt-1">
        <Pinyin text={lesson.titlePinyin} /> <span className="text-muted">· {lesson.titleVi}</span>
      </div>

      <nav className="mt-6 flex gap-1 border-b border-line overflow-x-auto">
        {PARTS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setParams({ part: p.id }, { replace: true })}
            className={`relative -mb-px whitespace-nowrap px-4 py-2.5 text-sm font-semibold border-b-2 cursor-pointer ${
              part === p.id ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {done[p.id] ? <span className="text-jade">✓ </span> : <span className="text-muted/60">{i + 1}. </span>}
            {p.label}
            <span className="ml-1.5 text-xs font-normal text-muted">~{p.minutes}′</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 pb-10" key={part}>
        {part === 'vocab' && <VocabPart lesson={lesson} newWordsToday={newWordsToday} onComplete={() => complete('vocab')} />}
        {part === 'grammar' && <GrammarPart lesson={lesson} completed={!!done.grammar} needsPractice={!!lessonState.get(lesson.id)?.needsPractice?.grammar} onComplete={(needsPractice) => markPart(lesson.id, 'grammar', needsPractice)} />}
        {part === 'dialogue' && <DialoguePart lesson={lesson} completed={!!done.dialogue} onComplete={() => complete('dialogue')} />}
        {part === 'writing' && <WritingPart lesson={lesson} completed={!!done.writing} onComplete={() => complete('writing')} />}
      </div>
    </div>
  )
}
