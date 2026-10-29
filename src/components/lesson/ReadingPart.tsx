import { useEffect, useRef, useState } from 'react'
import { WORDS } from '@/data/course'
import type { CourseLesson, Reading, Sentence, Word } from '@/data/types'
import { Button, Card } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { readingSentences } from '@/lib/sentences'
import { speak } from '@/lib/speech'
import { introduce } from '@/lib/srs'
import { useSettings } from '@/store/settings'

// Course words by their written form; the longest match wins when a sentence is split into words.
const BY_HANZI = new Map<string, Word>([...WORDS.values()].map(({ word }) => [word.hanzi, word]))
const LONGEST = Math.max(...[...BY_HANZI.keys()].map((h) => h.length))

/** Split a sentence into known course words (longest first) and leftover characters. */
export function segment(text: string): { text: string; word?: Word }[] {
  const out: { text: string; word?: Word }[] = []
  for (let i = 0; i < text.length;) {
    let hit: Word | undefined
    let len = 1
    for (let n = Math.min(LONGEST, text.length - i); n > 0; n--) {
      const w = BY_HANZI.get(text.slice(i, i + n))
      if (w) { hit = w; len = n; break }
    }
    out.push({ text: text.slice(i, i + len), word: hit })
    i += len
  }
  return out
}

function Line({ s, showPinyin, showVi, active }: { s: Sentence; showPinyin: boolean; showVi: boolean; active: boolean }) {
  const [picked, setPicked] = useState<Word | null>(null)
  return <li className={`rounded-xl px-3 py-2 ${active ? 'bg-gold-soft' : ''}`}>
    <div className="flex items-start gap-2">
      <SpeakButton text={s.hanzi} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="font-han text-xl leading-relaxed">{segment(s.hanzi).map((t, i) => t.word
          ? <button key={i} type="button" aria-label={`${t.text}: ${t.word.meaning}`} aria-pressed={picked === t.word} onClick={() => setPicked(picked === t.word ? null : t.word!)}
            className={`rounded cursor-pointer underline decoration-dotted decoration-muted/40 underline-offset-4 hover:bg-sunken ${picked === t.word ? 'bg-sunken' : ''}`}>{t.text}</button>
          : <span key={i}>{t.text}</span>)}</p>
        {showPinyin && <Pinyin text={s.pinyin} className="text-sm" />}
        {picked && <p className="mt-1 text-sm rounded-lg bg-sunken px-2 py-1" role="status"><span className="font-han text-base">{picked.hanzi}</span> <Pinyin text={picked.pinyin} /> · {picked.meaning}</p>}
        {showVi && <p className="text-sm text-muted mt-1">{s.vi}</p>}
      </div>
    </div>
  </li>
}

function Passage({ reading }: { reading: Reading }) {
  const [showPinyin, setShowPinyin] = useState(false)
  const [showVi, setShowVi] = useState(false)
  const [playing, setPlaying] = useState<number | null>(null)
  const stop = useRef(false)
  const rate = useSettings((s) => s.speechRate)
  useEffect(() => () => { stop.current = true; window.speechSynthesis?.cancel() }, [])
  const playAll = async () => {
    stop.current = false
    for (let i = 0; i < reading.sentences.length && !stop.current; i++) {
      setPlaying(i)
      await speak(reading.sentences[i].hanzi, rate)
      await new Promise((r) => setTimeout(r, 350))
    }
    setPlaying(null)
  }
  return <Card className="p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <h3 className="text-lg font-bold font-han">{reading.title}</h3>
      <Button variant="secondary" onClick={() => (playing === null ? playAll() : ((stop.current = true), window.speechSynthesis?.cancel(), setPlaying(null)))}>{playing === null ? '▶ Nghe cả bài' : '■ Dừng'}</Button>
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      <Button variant={showPinyin ? 'primary' : 'secondary'} aria-pressed={showPinyin} className="text-xs !py-1.5" onClick={() => setShowPinyin(!showPinyin)}>Pinyin</Button>
      <Button variant={showVi ? 'primary' : 'secondary'} aria-pressed={showVi} className="text-xs !py-1.5" onClick={() => setShowVi(!showVi)}>Bản dịch</Button>
      <span className="text-xs text-muted self-center">Bấm vào từ gạch chấm để xem nghĩa.</span>
    </div>
    <ol className="mt-4 space-y-1">{reading.sentences.map((s, i) => <Line key={i} s={s} showPinyin={showPinyin} showVi={showVi} active={playing === i} />)}</ol>
  </Card>
}

/** HSK 4+ reading: passage with pinyin and translation on demand, then comprehension questions. */
export function ReadingPart({ lesson, completed, onComplete }: { lesson: CourseLesson; completed: boolean; onComplete: () => void | Promise<void> }) {
  const readings = lesson.readings ?? []
  const questions = readings.flatMap((r) => r.questions.map((q, i) => ({ ...q, key: `${r.id}-${i}` })))
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [saved, setSaved] = useState(completed)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false)
  if (!readings.length) return <p className="text-muted">Bài này chưa có bài đọc.</p>
  const answered = questions.filter((q) => answers[q.key] !== undefined).length
  const right = questions.filter((q) => answers[q.key] === q.answer)
  const save = async () => {
    if (lock.current) return
    lock.current = true; setBusy(true); setError('')
    try {
      await introduce(readingSentences(lesson).map((s) => ({ kind: 'sentence' as const, ref: s.hanzi, lessonId: lesson.id, firstTry: null })))
      await onComplete()
      setSaved(true)
    } catch { setError('Chưa lưu được tiến độ. Hãy thử lại.') }
    finally { lock.current = false; setBusy(false) }
  }
  return <div className="space-y-5">
    {readings.map((r) => <Passage key={r.id} reading={r} />)}
    <Card className="p-5 sm:p-7">
      <h3 className="font-bold">Câu hỏi đọc hiểu</h3>
      <ol className="mt-4 space-y-5">{questions.map((q, n) => {
        const pick = answers[q.key]
        return <li key={q.key}>
          <p className="font-han text-lg">{n + 1}. {q.q}</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">{q.choices.map((c, i) => <Button key={i} className="font-han justify-start text-left !text-base"
            variant={pick === undefined ? 'secondary' : i === q.answer ? 'good' : pick === i ? 'danger' : 'secondary'}
            onClick={() => pick === undefined && setAnswers({ ...answers, [q.key]: i })}>{String.fromCharCode(65 + i)}. {c}</Button>)}</div>
          {pick !== undefined && <p role="status" className={`mt-2 text-sm ${pick === q.answer ? 'text-jade' : 'text-cinnabar'}`}>{pick === q.answer ? 'Đúng. ' : `Chưa đúng, đáp án ${String.fromCharCode(65 + q.answer)}. `}<span className="text-muted">{q.explain}</span></p>}
        </li>
      })}</ol>
      {error && <p role="alert" className="mt-3 text-sm text-cinnabar">{error}</p>}
      {answered === questions.length && (saved
        ? <p className="mt-5 font-semibold text-jade">Đã lưu · đúng {right.length}/{questions.length} câu. Các câu chính của bài đọc đã vào lịch ôn nghe hiểu.</p>
        : <Button className="mt-5" disabled={busy} onClick={save}>{busy ? 'Đang lưu…' : `Hoàn thành · đúng ${right.length}/${questions.length}`}</Button>)}
    </Card>
  </div>
}
