import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { findCourseLesson, LESSONS } from '@/data/course'
import type { LessonPart } from '@/lib/db'
import { markPart, unmarkPart, partsFor, lessonPartParam } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { Card, ButtonLink } from '@/components/ui/Button'
import { LessonHeader, LessonPartPicker } from '@/components/lesson/LessonHeader'
import { LessonSkeleton } from '@/components/lesson/LessonSkeleton'
import { LessonFinishBar } from '@/components/lesson/LessonFinishBar'
import { motion } from 'framer-motion'
import { EASE } from '@/components/ui/motion'
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

  if (!lesson) return <Card className="mx-auto mt-10 max-w-3xl p-6 text-center"><p className="text-headline">Không tìm thấy bài học</p><ButtonLink to="/lesson" className="mt-4">Về danh sách bài</ButtonLink></Card>

  if (!loaded) return <LessonSkeleton lesson={lesson} />

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
        navigate('/lesson')
      }
    } finally {
      changingPartRef.current = false
      setChangingPart(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl min-w-0 pt-5 sm:pt-7">
      <LessonHeader lesson={lesson} />
      <LessonPartPicker lesson={lesson} part={part} done={done}
        onChange={(id) => setParams((current) => { const next = new URLSearchParams(current); next.set('part', lessonPartParam(id)); return next }, { replace: true })} />

      <motion.div className="mt-7" key={`${lesson.id}:${part}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
        {part === 'chars' && <RadicalsPart lesson={lesson} />}
        {part === 'vocab' && <VocabPart lesson={lesson} />}
        {part === 'grammar' && <GrammarPart lesson={lesson} />}
        {part === 'confusables' && <ConfusablesPart pairs={lesson.confusables ?? []} />}
        {part === 'exercises' && <ExercisesPart lesson={lesson} />}
        {part === 'writing' && <WritingPart lesson={lesson} />}
      </motion.div>

      <LessonFinishBar
        done={!!done[part]}
        busy={changingPart}
        onClick={() => void togglePartDone()}
        status={done[part] ? 'Đã hoàn thành phần này.' : followingPart ? `Tiếp theo: ${followingPart.label}` : followingLesson ? `Tiếp theo: Bài ${followingLesson.number}` : 'Phần cuối của giáo trình'}
        label={done[part] ? 'Bỏ đánh dấu hoàn thành' : followingPart ? 'Hoàn thành & tiếp tục →' : followingLesson ? 'Hoàn thành & sang bài tiếp →' : 'Hoàn thành & về giáo trình →'} />
    </div>
  )
}
