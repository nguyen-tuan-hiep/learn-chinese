import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { type PronunciationUnit } from '@/data/pronunciationLearning'
import { markPart } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { Button, Card } from '@/components/ui/Button'
import { SpeakButton } from '@/components/hanzi/SpeakButton'

/** One activity per topic; the original foundation ids preserve existing progress. */
function ActivityContent({ unit, introduction = true, className = 'mt-6' }: { unit: PronunciationUnit; introduction?: boolean; className?: string }) {
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
  return <Card id={unit.id} className={`${className} scroll-mt-20 p-4 sm:p-5`}>
    <h2 className="text-lg font-semibold">{unit.title}</h2>
    <p className="mt-1 text-sm text-jade">{unit.goal}</p>
    {introduction && <><p className="mt-3 text-sm leading-relaxed">{unit.body}</p><ol className="mt-3 space-y-2">{unit.steps.map((step, i) => <li key={step} className="text-sm leading-relaxed"><span className="mr-2 font-medium text-muted">{i + 1}.</span>{step}</li>)}</ol></>}
    {unit.sample && <div className="mt-3 flex items-center gap-3"><SpeakButton text={unit.sample.say} /><span className="text-lg">{unit.sample.pinyin} <span className="font-han">{unit.sample.say}</span></span></div>}
    <div className="mt-4 space-y-5">{unit.questions.map((q, index) => <fieldset key={q.prompt} className="min-w-0">
      <legend className="mb-3 text-sm font-medium">{unit.questions.length > 1 ? `${index + 1}. ` : ''}{q.prompt}</legend>
      {q.say && <div className="mb-3 flex items-center gap-2"><SpeakButton text={q.say} /><span className="text-sm text-muted">Nghe trước khi chọn</span></div>}
      <div className="grid gap-2 lg:grid-flow-col lg:auto-cols-fr">{q.choices.map((choice, i) => <Button key={choice} variant={answers[index] === i ? 'primary' : 'secondary'} aria-pressed={answers[index] === i} onClick={() => setAnswers(old => ({ ...old, [index]: i }))}>{choice}</Button>)}</div>
      <div aria-live="polite" className="mt-2 text-sm">{answers[index] !== undefined && (answers[index] === q.answer ? <p className="text-jade">Đúng rồi.</p> : <p className="text-muted">{q.feedback} {q.review && <Link to={q.review} className="underline text-jade">Ôn lại nhóm âm →</Link>}</p>)}</div>
    </fieldset>)}</div>
    {busy && <p role="status" className="mt-2 text-xs text-muted">Đang lưu tiến độ…</p>}
    {error && <div className="mt-3"><p role="alert" className="text-sm text-cinnabar">{error}</p><Button variant="secondary" className="mt-2" disabled={busy || !correct} onClick={save}>Thử lưu lại</Button></div>}
  </Card>
}

export function PronunciationActivity(props: { unit: PronunciationUnit; introduction?: boolean; className?: string }) {
  return <ActivityContent key={props.unit.id} {...props} />
}
