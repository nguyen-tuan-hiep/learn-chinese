import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { findCourseLesson, levelName, LESSONS } from '@/data/course'
import type { LessonPart } from '@/lib/db'
import { markPart, unmarkPart, partsFor, lessonPartParam } from '@/lib/lessonState'
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
  const navigate = useNavigate()
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
  const [changingPart, setChangingPart] = useState(false)
  const changingPartRef = useRef(false)
  // Without ?part=, open the first unfinished part and stay there after it is completed.
  const opened = useRef<LessonPart | null>(null)

  if (!loaded) return <p role="status" className="pt-8">Đang tải tiến độ…</p>

  if (!lesson) return <p className="pt-10">Không tìm thấy bài học.</p>

  const done = lessonState.get(lesson.id)?.done ?? {}
  const requestedPart = params.get('part')
  const requested = requestedPart === 'radicals' ? 'chars' : requestedPart === 'dialogue' || requestedPart === 'reading' ? 'exercises' : requestedPart
  const parts = partsFor(lesson)
  const part = parts.find((p) => p.id === requested)?.id ?? (opened.current ??= parts.find((p) => !done[p.id])?.id ?? 'chars')
  const followingPart = parts[parts.findIndex((item) => item.id === part) + 1]
  const followingLesson = LESSONS[LESSONS.findIndex((item) => item.id === lesson.id) + 1]
  const togglePartDone = async () => {
    if (changingPartRef.current) return
    changingPartRef.current = true
    setChangingPart(true)
    try {
      if (done[part]) {
        await unmarkPart(lesson.id, part)
        return
      }

      await markPart(lesson.id, part)
      if (followingPart) {
        setParams((current) => {
          const next = new URLSearchParams(current)
          next.set('part', lessonPartParam(followingPart.id))
          return next
        })
        return
      }

      if (followingLesson) {
        const nextLessonPart = partsFor(followingLesson)[0]
        navigate(`/lesson/${followingLesson.id}?part=${lessonPartParam(nextLessonPart.id)}`)
      } else {
        navigate('/course')
      }
    } finally {
      changingPartRef.current = false
      setChangingPart(false)
    }
  }

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
        {part === 'chars' && <RadicalsPart lesson={lesson} />}
        {part === 'vocab' && <VocabPart lesson={lesson} />}
        {part === 'grammar' && <GrammarPart lesson={lesson} />}
        {part === 'confusables' && <ConfusablesPart pairs={lesson.confusables ?? []} />}
        {part === 'exercises' && <ExercisesPart lesson={lesson} />}
        {part === 'writing' && <WritingPart lesson={lesson} />}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <p className="text-sm text-muted">{done[part] ? 'Bỏ đánh dấu sẽ giữ bạn ở phần này.' : followingPart ? `Hoàn thành để chuyển sang ${followingPart.label}.` : followingLesson ? `Hoàn thành để sang bài ${followingLesson.number}.` : 'Hoàn thành để quay lại giáo trình.'}</p>
          <button
            type="button"
            disabled={changingPart}
            onClick={() => void togglePartDone()}
            className={`min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${done[part] ? 'border border-line bg-surface text-ink hover:bg-sunken' : 'bg-jade text-white hover:opacity-90 dark:text-paper'}`}
          >
            {changingPart ? 'Đang lưu…' : done[part] ? 'Bỏ đánh dấu hoàn thành' : followingPart ? 'Hoàn thành & tiếp tục →' : followingLesson ? 'Hoàn thành & sang bài tiếp →' : 'Hoàn thành & về giáo trình →'}
          </button>
        </div>
      </div>
    </div>
  )
}
