import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { type PronunciationUnit } from '@/data/pronunciationLearning'
import { markPart } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { Card } from '@/components/ui/Button'
import { ValueBadge } from '@/components/ui/ValueBadge'
import { spring } from '@/components/ui/motion'
import { SpeakButton } from '@/components/hanzi/SpeakButton'

const SHAKE = { x: [0, -7, 6, -4, 2, 0] }

/** One activity per topic; the original foundation ids preserve existing progress. */
function ActivityContent({ unit, introduction = true, className = 'mt-6' }: { unit: PronunciationUnit; introduction?: boolean; className?: string }) {
  const reduce = useReducedMotion()
  const { lessonState } = useStudyData()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false)
  const completed = saved || !!lessonState.get(unit.id)?.done.dialogue
  const correct = unit.questions.every((q, i) => answers[i] === q.answer)
  const save = useCallback(async () => {
    if (lock.current || !correct || completed) return
    lock.current = true; setBusy(true); setError('')
    try { await markPart(unit.id, 'dialogue'); setSaved(true) }
    catch { setError('Chưa lưu được tiến độ. Hãy thử lại.') }
    finally { lock.current = false; setBusy(false) }
  }, [correct, completed, unit.id])
  useEffect(() => {
    if (correct && !completed) void save()
  }, [correct, completed, save])

  const label = completed ? 'Đã học' : busy ? 'Đang lưu…' : error ? 'Thử lưu lại' : 'Đánh dấu đã học'
  return <Card id={unit.id} className={`${className} scroll-mt-20 p-5 sm:p-6`}>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-title3">{unit.title}</h2>
        <p className="mt-1 text-subhead text-secondary-label">{unit.goal}</p>
      </div>
      {completed && <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-success-soft text-success-text" aria-hidden="true"><Check size={16} strokeWidth={3} /></span>}
    </div>
    {introduction && <>
      <p className="mt-4 text-body leading-relaxed">{unit.body}</p>
      <ol className="mt-4 space-y-2.5">{unit.steps.map((step, i) => <li key={step} className="flex gap-3 text-subhead leading-relaxed">
        <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-feature-pronunciation-soft text-caption font-bold tabular-nums">{i + 1}</span>
        <span className="min-w-0">{step}</span>
      </li>)}</ol>
    </>}
    {unit.sample && <div className="mt-4 flex items-center gap-3 rounded-2xl bg-fill p-3"><SpeakButton text={unit.sample.say} /><span className="text-title3">{unit.sample.pinyin} <span lang="zh-CN" className="font-han">{unit.sample.say}</span></span></div>}
    <div className="mt-5 space-y-6">{unit.questions.map((q, index) => <fieldset key={q.prompt} className="min-w-0">
      <legend className="mb-3 text-headline">{unit.questions.length > 1 ? `${index + 1}. ` : ''}{q.prompt}</legend>
      {q.say && <div className="mb-3 flex items-center gap-2"><SpeakButton text={q.say} /><span className="text-subhead text-secondary-label">Nghe trước khi chọn</span></div>}
      <div className="grid gap-2 lg:grid-flow-col lg:auto-cols-fr">{q.choices.map((choice, i) => {
        const picked = answers[index] === i
        const right = picked && i === q.answer
        const wrong = picked && i !== q.answer
        return <motion.button key={choice} type="button" aria-pressed={picked}
          onClick={() => setAnswers(old => ({ ...old, [index]: i }))}
          animate={wrong && !reduce ? SHAKE : { x: 0 }} whileTap={{ scale: 0.97 }}
          transition={wrong ? { duration: 0.35 } : spring.snappy}
          className={`flex min-h-11 cursor-pointer items-center justify-center rounded-full px-5 py-2.5 text-center text-subhead font-semibold ${right ? 'bg-success-soft text-success-text' : wrong ? 'bg-danger-soft text-danger-text' : 'bg-fill text-label'}`}>
          {choice}
        </motion.button>
      })}</div>
      <div aria-live="polite" className="mt-2 min-h-5 text-subhead">{answers[index] !== undefined && (answers[index] === q.answer ? <p className="text-success-text">Đúng rồi.</p> : <p className="text-secondary-label">{q.feedback} {q.review && <Link to={q.review} className="text-tint-text underline">Ôn lại nhóm âm →</Link>}</p>)}</div>
    </fieldset>)}</div>

    <div className="mt-5 flex items-center gap-3 border-t border-separator pt-4">
      <motion.button type="button" layout transition={spring.snappy} onClick={() => { void save() }} disabled={completed || busy || !correct} whileTap={completed ? undefined : { scale: 0.96 }}
        aria-live="polite"
        className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full px-5 text-subhead font-semibold disabled:cursor-default ${completed ? 'bg-success-soft text-success-text' : 'bg-primary-bg text-on-primary disabled:opacity-40'}`}>
        {completed && <Check size={16} strokeWidth={3} aria-hidden="true" />}
        <motion.span layout="position">{label}</motion.span>
      </motion.button>
      {saved && <ValueBadge value="+1" />}
      {!completed && !correct && <span className="min-w-0 text-footnote text-secondary-label">Trả lời đúng để lưu tiến độ</span>}
    </div>
    {busy && <p role="status" className="sr-only">Đang lưu tiến độ…</p>}
    {error && <p role="alert" className="mt-3 text-subhead text-danger-text">{error}</p>}
  </Card>
}

/** Foundation unit card: intro, quiz with pill answers, and a pill that morphs from "Đánh dấu đã học" to "✓ Đã học" once saved. */
export function PronunciationActivity(props: { unit: PronunciationUnit; introduction?: boolean; className?: string }) {
  return <ActivityContent key={props.unit.id} {...props} />
}
