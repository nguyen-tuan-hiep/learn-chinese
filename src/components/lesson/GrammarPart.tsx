import { useMemo, useRef, useState } from 'react'
import type { CourseLesson, Drill, GrammarPoint } from '@/data/types'
import { Button, Card } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { PinyinInput } from '@/components/hanzi/PinyinInput'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { drillSentences } from '@/lib/sentences'
import { shuffle } from '@/lib/shuffle'
import { introduce } from '@/lib/srs'

function OrderDrill({ drill, onDone }: { drill: Extract<Drill, { type: 'order' }>; onDone: (correct: boolean) => void }) {
  const pool = useMemo(() => {
    let s = shuffle(drill.tokens.map((t, i) => ({ t, i })))
    // never start already solved
    if (s.every((x, k) => x.t === drill.tokens[k]) && s.length > 1) s = [...s.slice(1), s[0]]
    return s
  }, [drill])
  const [picked, setPicked] = useState<number[]>([])
  const [result, setResult] = useState<boolean | null>(null)
  const sentence = picked.map((k) => pool[k].t).join('')

  return (
    <div>
      <p className="font-medium">Sắp xếp thành câu: “{drill.vi}”</p>
      <div className="mt-3 min-h-12 rounded-xl border border-dashed border-line px-3 py-2 flex flex-wrap gap-2 items-center">
        {picked.map((k, n) => (
          <button
            key={n}
            disabled={result !== null}
            onClick={() => setPicked(picked.filter((_, m) => m !== n))}
            className="font-han text-xl rounded-lg bg-sunken px-3 py-1 cursor-pointer"
          >
            {pool[k].t}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pool.map((x, k) => (
          <button
            key={k}
            disabled={picked.includes(k) || result !== null}
            onClick={() => setPicked([...picked, k])}
            className="font-han text-xl rounded-lg border border-line bg-surface px-3 py-1 cursor-pointer disabled:opacity-20"
          >
            {x.t}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        {result === null ? (
          <Button
            disabled={picked.length !== pool.length}
            onClick={() => {
              const ok = sentence === drill.tokens.join('')
              setResult(ok)
              onDone(ok)
            }}
          >
            Kiểm tra
          </Button>
        ) : (
          <>
            <span className={`font-semibold ${result ? 'text-jade' : 'text-cinnabar'}`}>{result ? 'Đúng' : 'Chưa đúng'}</span>
            <span className="font-han text-lg">{drill.tokens.join('')}</span>
            <Pinyin text={drill.pinyin} className="text-sm" />
            <SpeakButton text={drill.tokens.join('')} size="sm" />
            {!result && (
              <Button variant="ghost" onClick={() => (setPicked([]), setResult(null))}>
                Làm lại
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function TranslateDrill({ drill, onDone }: { drill: Extract<Drill, { type: 'translate' }>; onDone: (correct: boolean) => void }) {
  const [shown, setShown] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [retry, setRetry] = useState(0)
  return (
    <div>
      <p className="font-medium">Nói bằng tiếng Trung (gõ pinyin): “{drill.vi}”</p>
      <div className="mt-3">
        <PinyinInput
          key={retry}
          size="md"
          autoFocus={false}
          expected={drill.pinyin}
          onResult={(v) => {
            setShown(true)
            setCorrect(v === 'correct')
            onDone(v === 'correct')
          }}
        />
      </div>
      {shown && (
        <div className="flex items-center gap-3">
          <span className="font-han text-xl">{drill.hanzi}</span>
          <SpeakButton text={drill.hanzi} size="sm" />
        </div>
      )}
      {shown && !correct && <Button variant="secondary" className="mt-3" onClick={() => { setShown(false); setRetry((n) => n + 1) }}>Luyện lại câu này</Button>}
    </div>
  )
}

function Point({ g, onDrill }: { g: GrammarPoint; onDrill: (key: string, correct: boolean) => void }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold">{g.title}</h3>
      <div className="mt-3 inline-block rounded-lg bg-sunken px-3 py-1.5 font-han text-[15px] font-semibold">{g.pattern}</div>
      <p className="mt-3 leading-relaxed">{g.explanation}</p>
      <ul className="mt-4 space-y-2">
        {g.examples.map((ex) => (
          <li key={ex.hanzi + ex.vi} className="flex items-start gap-3">
            <SpeakButton text={ex.hanzi} size="sm" />
            <div>
              <div className="font-han text-lg">{ex.hanzi}</div>
              <div className="text-sm">
                <Pinyin text={ex.pinyin} /> <span className="text-muted">· {ex.vi}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 pt-5 border-t border-line space-y-6">
        <div className="text-xs font-bold uppercase tracking-wider text-muted">Luyện tập</div>
        {g.drills.map((d, i) =>
          d.type === 'order' ? (
            <OrderDrill key={i} drill={d} onDone={(ok) => onDrill(`${g.id}-${i}`, ok)} />
          ) : (
            <TranslateDrill key={i} drill={d} onDone={(ok) => onDrill(`${g.id}-${i}`, ok)} />
          ),
        )}
      </div>
    </Card>
  )
}

export function GrammarPart({ lesson, onComplete, completed, needsPractice }: { lesson: CourseLesson; onComplete: (needsPractice: boolean) => Promise<void>; completed: boolean; needsPractice: boolean }) {
  const total = lesson.grammar.reduce((n, g) => n + g.drills.length, 0)
  // First attempt per drill decides whether its translate card starts as known or not.
  const [tried, setTried] = useState<Map<string, boolean>>(new Map())
  const [correct, setCorrect] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false)
  const finish = async () => {
    if (lock.current) return
    lock.current = true
    setBusy(true)
    setError('')
    try {
      await introduce(drillSentences(lesson).map((d) => ({ kind: 'translate' as const, ref: d.hanzi, lessonId: lesson.id, firstTry: tried.get(d.key) ?? false })))
      await onComplete(correct.size < total)
    } catch { setError('Chưa lưu được bài học. Hãy thử lại.') }
    finally { lock.current = false; setBusy(false) }
  }
  return (
    <div className="space-y-5">
      {lesson.grammar.map((g) => (
        <Point key={g.id} g={g} onDrill={(k, ok) => { setTried((t) => (t.has(k) ? t : new Map(t).set(k, ok))); if (ok) setCorrect((s) => new Set(s).add(k)) }} />
      ))}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">
          Đã làm {tried.size}/{total} · trả lời đúng {correct.size}/{total}
        </span>
        <Button disabled={tried.size < total || busy || (completed && !needsPractice)} onClick={finish}>
          {busy ? 'Đang lưu…' : completed && !needsPractice ? 'Đã hoàn thành' : correct.size < total ? 'Lưu bài học · cần luyện lại' : 'Hoàn thành và thêm câu vào lịch ôn'}
        </Button>
      </div>
      {needsPractice && <p className="text-sm text-muted">Bạn đã học phần này, còn câu cần luyện lại. Làm lại các bài tập để củng cố.</p>}
      {error && <p role="alert" className="text-cinnabar">{error}</p>}
    </div>
  )
}
