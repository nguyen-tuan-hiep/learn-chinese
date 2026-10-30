import { useEffect, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { findCourseLesson, levelName } from '@/data/course'
import type { LessonPart } from '@/lib/db'
import { markPart, partsFor, lessonPartParam } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { RadicalsPart } from '@/components/lesson/RadicalsPart'
import { VocabPart } from '@/components/lesson/VocabPart'
import { GrammarPart } from '@/components/lesson/GrammarPart'
import { WritingPart } from '@/components/lesson/WritingPart'
import { ExercisesPart } from '@/components/lesson/ExercisesPart'
import { ConfusablesPart } from '@/components/lesson/ConfusablesPart'

export function LessonPage() {
  useStudyTimer()
  const { id = '' } = useParams()
  const [params, setParams] = useSearchParams()
  useEffect(() => {
    if (params.get('part') !== 'chars') return
    setParams((current) => {
      const next = new URLSearchParams(current)
      next.set('part', 'radicals')
      return next
    }, { replace: true })
  }, [params, setParams])
  const lesson = findCourseLesson(id)
  const { loaded, lessonState } = useStudyData()
  // Without ?part=, open the first unfinished part and stay there after it is completed.
  const opened = useRef<LessonPart | null>(null)

  if (!loaded) return <p role="status" className="pt-8">Đang tải tiến độ…</p>

  if (!lesson) return <p className="pt-10">Không tìm thấy bài học.</p>

  const done = lessonState.get(lesson.id)?.done ?? {}
  const requestedPart = params.get('part')
  const requested = requestedPart === 'radicals' ? 'chars' : requestedPart === 'dialogue' || requestedPart === 'reading' ? 'exercises' : requestedPart
  const parts = partsFor(lesson)
  const part = parts.find((p) => p.id === requested)?.id ?? (opened.current ??= parts.find((p) => !done[p.id])?.id ?? 'chars')
  const complete = (p: LessonPart) => markPart(lesson.id, p)

  return (
    <div className="w-full min-w-0 pt-6">
      <Link to="/course" className="text-sm text-muted hover:text-ink">
        ← Giáo trình {levelName(lesson.level)}
      </Link>
      <div className="mt-3 flex items-baseline gap-4 flex-wrap">
        <span className="text-sm font-bold text-muted">Bài {lesson.number}</span>
        <h1 className="font-han text-3xl sm:text-4xl leading-relaxed">{lesson.title}</h1>
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{lesson.textbookVolume} · HSK Standard Course</p>
      <div className="mt-1">
        {lesson.titlePinyin && <><Pinyin text={lesson.titlePinyin} /> <span className="text-muted">· </span></>}
        <span className="text-muted">{lesson.titleVi}</span>
      </div>
      <nav className="mt-3 flex gap-1 border-b border-line overflow-x-auto">
        {parts.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setParams((current) => { const next = new URLSearchParams(current); next.set('part', lessonPartParam(p.id)); return next }, { replace: true })}
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

      <div className="mt-6 pb-10" key={`${lesson.id}:${part}`}>
        {part === 'chars' && <RadicalsPart lesson={lesson} completed={!!done.chars} onComplete={() => complete('chars')} />}
        {part === 'vocab' && <VocabPart lesson={lesson} onComplete={() => complete('vocab')} />}
        {part === 'grammar' && <GrammarPart lesson={lesson} completed={!!done.grammar} needsPractice={!!lessonState.get(lesson.id)?.needsPractice?.grammar} onComplete={(needsPractice) => markPart(lesson.id, 'grammar', needsPractice)} />}
        {part === 'confusables' && <ConfusablesPart pairs={lesson.confusables ?? []} />}
        {part === 'exercises' && <ExercisesPart lesson={lesson} completed={!!done.exercises} onComplete={() => complete('exercises')} />}
        {part === 'writing' && <WritingPart lesson={lesson} completed={!!done.writing} onComplete={() => complete('writing')} />}
      </div>
    </div>
  )
}
