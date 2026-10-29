import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { newCharacters } from '@/data/course'
import type { CourseLesson } from '@/data/types'
import { Button, Card } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { StrokeWriter, type WriterMode } from '@/components/hanzi/StrokeWriter'
import { charInfo } from '@/lib/chars'
import { introduce } from '@/lib/srs'
import { useStudyData } from '@/lib/useStudyData'

const STEPS: [WriterMode, string][] = [
  ['animate', 'Xem thứ tự nét'],
  ['trace', 'Tô theo mẫu'],
  ['recall', 'Tự viết không nhìn'],
]

/** For each new character: watch the stroke order, trace it, then write it from memory. */
export function WritingPart({ lesson, onComplete, completed }: { lesson: CourseLesson; onComplete: () => void; completed: boolean }) {
  const { loaded, cards } = useStudyData()
  if (!loaded) return <p role="status">Đang tải tiến độ viết…</p>
  const learned = new Set(cards.filter((c) => c.kind === 'write').map((c) => c.ref))
  const all = newCharacters(lesson)
  const unseen = all.filter((ch) => !learned.has(ch))
  return <WritingBatch lesson={lesson} onComplete={onComplete} completed={completed} candidates={unseen.length ? unseen : all} />
}

function WritingBatch({ lesson, onComplete, completed, candidates }: { lesson: CourseLesson; onComplete: () => void; completed: boolean; candidates: string[] }) {
  const [chars] = useState(() => candidates.slice(0, 3))
  const [remaining] = useState(() => Math.max(0, candidates.length - chars.length))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false)
  const [i, setI] = useState(0)
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<number | null>(null)
  const [firstTry] = useState(() => new Map<string, boolean>())
  const [finished, setFinished] = useState(false)

  if (finished) {
    return (
      <Card className="p-6 text-center">
        <p className="font-semibold">Đã thêm {chars.length} chữ vào lịch ôn viết.</p>
        <p className="text-sm text-muted mt-1">Trong phiên ôn, bạn sẽ được yêu cầu viết lại các chữ này theo lịch giãn cách.</p>
        <p className="text-sm text-muted mt-2">{remaining ? `Còn ${remaining} chữ trong bài. Quay lại vào buổi sau để luyện tiếp.` : 'Bạn đã luyện hết chữ mới trong bài.'}</p>
        <Link to="/" className="inline-block mt-4 underline font-semibold">Về buổi học hôm nay →</Link>
        <p className="sr-only">Đã lưu</p>
      </Card>
    )
  }

  const ch = chars[i]
  const info = charInfo(ch)
  const mode = STEPS[step][0]

  const advance = async () => {
    if (step < 2) {
      setStep(step + 1)
      setResult(null)
      return
    }
    if (i < chars.length - 1) {
      setI(i + 1)
      setStep(0)
      setResult(null)
      return
    }
    if (lock.current) return
    lock.current = true; setBusy(true); setError('')
    try {
      await introduce(chars.map((c) => ({ kind: 'write' as const, ref: c, lessonId: lesson.id, firstTry: firstTry.get(c) ?? false })))
      if (!remaining) await onComplete()
      setFinished(true)
    } catch { setError('Chưa lưu được tiến độ viết. Hãy thử lại.') }
    finally { lock.current = false; setBusy(false) }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] gap-6 items-start">
      <Card className="p-4 sm:p-6 min-w-0 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-1.5 mb-5">
          {STEPS.map(([m, label], k) => (
            <span key={m} className={`rounded-lg px-3 py-1 text-sm ${k === step ? 'bg-ink text-paper' : k < step ? 'bg-jade-soft text-jade' : 'bg-sunken text-muted'}`}>
              {label}
            </span>
          ))}
        </div>
        <StrokeWriter
          key={`${ch}-${step}`}
          char={ch}
          mode={mode}
          onComplete={(m) => {
            setResult(m)
            if (mode === 'recall') firstTry.set(ch, firstTry.get(ch) !== false && m <= 2)
          }}
        />
        <div className="mt-4 min-h-10 flex flex-wrap justify-center items-center gap-3">
          {mode !== 'animate' && result === null && <span className="text-sm text-muted">Dùng chuột hoặc ngón tay viết từng nét theo đúng thứ tự.</span>}
          {result !== null && <span className={`text-sm font-semibold ${result === 0 ? 'text-jade' : 'text-tone2'}`}>{result === 0 ? 'Không sai nét nào' : `${result} nét sai`}</span>}
          {(mode === 'animate' || result !== null) && (
            <Button disabled={busy} onClick={advance}>{step < 2 ? 'Bước tiếp' : i < chars.length - 1 ? 'Chữ tiếp theo' : busy ? 'Đang lưu…' : completed ? 'Xong' : 'Lưu nhóm chữ này'}</Button>
          )}
          {mode === 'recall' && result !== null && result > 2 && (
            <Button variant="ghost" onClick={() => (setResult(null), setStep(1))}>
              Tô lại
            </Button>
          )}
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-cinnabar">{error}</p>}
      </Card>
      <Card className="p-5">
        <div className="text-sm text-muted">
          Chữ {i + 1}/{chars.length} trong buổi này{remaining > 0 && ` · còn ${remaining} chữ để học sau`}
        </div>
        {mode === 'recall' && result === null ? <div className="mt-3 space-y-3">
          <p className="font-semibold">Tự viết từ trí nhớ</p>
          <Pinyin text={info.pinyin} className="text-xl" />
          <p className="text-sm text-muted">Nghĩa trong bài: {info.words.find((w) => w.lesson.id === lesson.id)?.word.meaning}</p>
          <Button variant="secondary" onClick={() => { firstTry.set(ch, false); setResult(null); setStep(1) }}>Chưa nhớ, tô lại mẫu</Button>
        </div> : <><div className="flex items-center gap-3 mt-2">
          <span className="font-han text-6xl">{ch}</span>
          <div>
            <Pinyin text={info.pinyin} className="text-xl" />
            <div>
              <SpeakButton text={ch} size="sm" />
            </div>
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {info.words.slice(0, 4).map(({ word }) => (
            <li key={word.id + word.hanzi}>
              <span className="font-han text-base">{word.hanzi}</span> <Pinyin text={word.pinyin} /> · {word.meaning}
              {word.parts && word.hanzi === ch && <div className="text-muted font-han mt-1">{word.parts}</div>}
            </li>
          ))}
        </ul></>}
      </Card>
    </div>
  )
}
