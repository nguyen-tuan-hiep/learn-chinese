import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BEGINNER_SESSIONS, beginnerProgress } from '@/lib/beginner'
import { markPart } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { Button, Card } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { PinyinInput } from '@/components/hanzi/PinyinInput'
import { SpeakButton } from '@/components/hanzi/SpeakButton'

type Session = (typeof BEGINNER_SESSIONS)[number]

function SessionContent({ session, completed }: { session: Session; completed: boolean }) {
  const [correct, setCorrect] = useState(false)
  const [attempt, setAttempt] = useState<number | null>(null)
  const [retry, setRetry] = useState(0)
  const [saved, setSaved] = useState(completed)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false)
  const next = BEGINNER_SESSIONS[BEGINNER_SESSIONS.indexOf(session) + 1]
  const save = async () => {
    if (lock.current) return
    lock.current = true
    setBusy(true)
    try { await markPart(session.id, 'dialogue'); setSaved(true) }
    catch { setError('Chưa lưu được tiến độ. Hãy thử lại.'); }
    finally { lock.current = false; setBusy(false) }
  }
  return <div className="space-y-5">
    <Card className="p-5 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-muted">Buổi {BEGINNER_SESSIONS.indexOf(session) + 1} · khoảng {session.minutes} phút</p>
      <h2 className="text-xl font-bold mt-2">{session.title}</h2>
      <p className="mt-2 font-medium">Sau buổi này: {session.goal}</p>
      <p className="mt-4 leading-relaxed">{session.body}</p>
      <ul className="mt-5 space-y-3">{session.examples.map((ex) => <li key={ex.hanzi} className="flex items-start gap-3 rounded-xl bg-sunken p-3">
        <SpeakButton text={ex.hanzi} />
        <div className="min-w-0"><div className="font-han text-2xl">{ex.hanzi}</div><Pinyin text={ex.pinyin} /><p className="text-sm text-muted mt-1">{ex.vi}</p></div>
      </li>)}</ul>
      {session.id === 'start-01' && <p className="mt-4 text-sm text-muted">Không nghe được? <Link className="underline" to="/stats#settings">Kiểm tra giọng đọc trong Cài đặt</Link>. Bạn có thể quay lại buổi này sau khi cài giọng tiếng Trung.</p>}
    </Card>
    <Card className="p-5 sm:p-7">
      <h3 className="font-bold">Thử một chút</h3><p className="mt-2 mb-4">{session.question}</p>
      {'choices' in session ? <div className="grid gap-2">{session.choices.map((choice, i) => <Button key={choice} variant={attempt === i ? 'primary' : 'secondary'} onClick={() => { setAttempt(i); setCorrect(i === session.answer) }}>{choice}</Button>)}</div> : <PinyinInput key={retry} expected={session.expected} autoFocus={false} onResult={(v) => { setCorrect(v === 'correct'); setAttempt(0) }} />}
      <div aria-live="polite" className="mt-3 text-sm">
        {correct ? <p className="text-jade font-semibold">Đúng rồi. Bạn có thể hoàn thành buổi này.</p> : attempt !== null && <><p className="text-muted">{'feedback' in session ? session.feedback : 'Xem lại cách gõ trong ví dụ, rồi thử lại nhé.'}</p>{!('choices' in session) && <Button className="mt-2" variant="secondary" onClick={() => { setRetry((n) => n + 1); setAttempt(null) }}>Thử lại</Button>}</>}
      </div>
      {error && <p role="alert" className="mt-3 text-cinnabar">{error}</p>}
      {!saved ? <Button className="mt-5" disabled={!correct || busy} onClick={save}>{busy ? 'Đang lưu…' : 'Hoàn thành buổi này'}</Button> : <div className="mt-5 rounded-xl bg-jade-soft p-4"><p className="text-jade font-semibold">Đã hoàn thành · {session.goal}</p><Link className="inline-block mt-3 underline font-semibold" to={next ? `/start?session=${next.id}` : '/radicals/radicals-01'}>{next ? 'Buổi tiếp theo →' : 'Học bộ thủ đầu tiên →'}</Link><p className="text-sm text-muted mt-2">Bạn có thể dừng ở đây và học tiếp vào ngày mai.</p></div>}
    </Card>
  </div>
}

export function StartPage() {
  useStudyTimer()
  const { loaded, lessonState } = useStudyData()
  const [params] = useSearchParams()
  const progress = beginnerProgress(lessonState)
  const session = BEGINNER_SESSIONS.find((s) => s.id === params.get('session')) ?? progress.next ?? BEGINNER_SESSIONS[0]
  if (!loaded) return <p role="status" className="pt-8">Đang tải tiến độ…</p>
  return <div className="max-w-3xl pt-6 pb-8">
    <Link to="/" className="text-sm text-muted underline">← Hôm nay</Link>
    <h1 className="mt-3 text-2xl font-bold">Bắt đầu từ số 0</h1>
    <p className="mt-2 text-muted">7 buổi ngắn, học theo nhịp của bạn. Không cần học hết bảng pinyin trong một ngày.</p>
    <p className="mt-3 text-sm font-semibold">Đã hoàn thành {progress.completed}/{progress.total} buổi</p>
    <nav aria-label="Các buổi nhập môn" className="flex flex-wrap gap-2 my-5">{BEGINNER_SESSIONS.map((s, i) => <Link key={s.id} aria-current={s.id === session.id ? 'step' : undefined} to={`/start?session=${s.id}`} className={`min-h-11 min-w-11 grid place-items-center rounded-xl border ${s.id === session.id ? 'bg-ink text-paper border-ink' : 'border-line bg-surface'}`} aria-label={`Buổi ${i + 1}: ${s.title}${lessonState.get(s.id)?.done.dialogue ? ', đã hoàn thành' : ''}`}>{lessonState.get(s.id)?.done.dialogue ? '✓ ' : ''}{i + 1}</Link>)}</nav>
    <SessionContent key={session.id} session={session} completed={!!lessonState.get(session.id)?.done.dialogue} />
  </div>
}
