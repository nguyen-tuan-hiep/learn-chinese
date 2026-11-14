import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, RotateCcw } from 'lucide-react'
import type { CourseLesson, Drill, GrammarPoint } from '@/data/types'
import { Button, Card } from '@/components/ui/Button'
import { Rise, Stagger, spring } from '@/components/ui/motion'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { PinyinInput } from '@/components/hanzi/PinyinInput'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { partSoft } from '@/lib/palette'
import { shuffle } from '@/lib/shuffle'
import { PartBar, PartTitle } from './parts/PartTitle'
import { Result } from './parts/Result'

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
      <p className="text-body font-medium">Sắp xếp thành câu: “{drill.vi}”</p>
      {/* Slot keeps its height when empty so the tiles below don't jump. */}
      <div aria-label="Câu của bạn" className="mt-3 flex min-h-14 flex-wrap items-center gap-2 rounded-2xl bg-fill px-3 py-2">
        {picked.length === 0 && <span className="text-subhead text-tertiary-label">Bấm các mảnh bên dưới để ghép câu</span>}
        {picked.map((k, n) => (
          <motion.button
            layout
            transition={spring.snappy}
            key={pool[k].i}
            type="button"
            disabled={result !== null}
            onClick={() => setPicked(picked.filter((_, m) => m !== n))}
            className="min-h-11 cursor-pointer rounded-full px-4 font-han text-xl text-label disabled:cursor-default"
            style={{ background: partSoft('grammar') }}
          >
            {pool[k].t}
          </motion.button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pool.map((x, k) => (
          <button
            key={k}
            type="button"
            disabled={picked.includes(k) || result !== null}
            onClick={() => setPicked([...picked, k])}
            className="min-h-11 cursor-pointer rounded-full glass-thin px-4 font-han text-xl text-label transition-opacity active:scale-[0.96] disabled:opacity-25"
          >
            {x.t}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
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
            <Result ok={result}>{result ? 'Đúng' : 'Chưa đúng'}</Result>
            {!result && (
              <Button variant="secondary" onClick={() => (setPicked([]), setResult(null))}>
                <RotateCcw aria-hidden="true" className="size-4" />Làm lại
              </Button>
            )}
          </>
        )}
      </div>
      {result !== null && (
        <div className="mt-3 flex items-start gap-3">
          <SpeakButton text={drill.tokens.join('')} size="sm" />
          <div className="min-w-0">
            <div lang="zh-CN" className="font-han text-xl">{drill.tokens.join('')}</div>
            <Pinyin text={drill.pinyin} className="text-subhead" />
          </div>
        </div>
      )}
    </div>
  )
}

function TranslateDrill({ drill, onDone }: { drill: Extract<Drill, { type: 'translate' }>; onDone: (correct: boolean) => void }) {
  const [shown, setShown] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [retry, setRetry] = useState(0)
  return (
    <div>
      <p className="text-body font-medium">Nói bằng tiếng Trung (gõ pinyin): “{drill.vi}”</p>
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
        <div className="mt-3 flex items-center gap-3">
          <SpeakButton text={drill.hanzi} size="sm" />
          <span lang="zh-CN" className="font-han text-xl">{drill.hanzi}</span>
        </div>
      )}
      {shown && !correct && <Button variant="secondary" className="mt-3" onClick={() => { setShown(false); setCorrect(false); setRetry((n) => n + 1) }}><RotateCcw aria-hidden="true" className="size-4" />Luyện lại câu này</Button>}
    </div>
  )
}

function Point({ g, index, onDrill }: { g: GrammarPoint; index: number; onDrill: (key: string, correct: boolean) => void }) {
  return (
    <Card className="min-w-0 p-5 sm:p-7">
      <div className="flex items-start gap-3.5">
        <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full text-subhead font-bold tabular-nums" style={{ background: partSoft('grammar'), color: 'var(--color-tint-text)' }}>{index + 1}</span>
        <h3 className="min-w-0 pt-0.5 text-title3 text-label">{g.title}</h3>
      </div>
      <div lang="zh-CN" className="mt-4 inline-block max-w-full rounded-2xl px-4 py-2.5 font-han text-callout font-semibold break-words text-label" style={{ background: partSoft('grammar') }}>{g.pattern}</div>
      <p className="mt-4 text-body leading-relaxed text-secondary-label">{g.explanation}</p>
      <ul className="mt-5 divide-y divide-separator border-t border-separator">
        {g.examples.map((ex) => (
          <li key={ex.hanzi + ex.vi} className="flex items-start gap-3 py-3.5">
            <SpeakButton text={ex.hanzi} size="sm" />
            <div className="min-w-0">
              <div lang="zh-CN" className="font-han text-xl leading-snug break-words">{ex.hanzi}</div>
              <div className="mt-0.5 text-subhead"><Pinyin text={ex.pinyin} /></div>
              <div className="mt-0.5 text-subhead text-secondary-label">{ex.vi}</div>
            </div>
          </li>
        ))}
      </ul>
      {g.drills.length > 0 && <div className="mt-3 space-y-7 border-t border-separator pt-5">
        <p className="text-footnote font-semibold text-secondary-label">Luyện tập · {g.drills.length} câu</p>
        {g.drills.map((d, i) =>
          d.type === 'order' ? (
            <OrderDrill key={i} drill={d} onDone={(ok) => onDrill(`${g.id}-${i}`, ok)} />
          ) : (
            <TranslateDrill key={i} drill={d} onDone={(ok) => onDrill(`${g.id}-${i}`, ok)} />
          ),
        )}
      </div>}
    </Card>
  )
}

/** Ngữ pháp & ghi chú: each grammar point is a panel with pattern, explanation, examples and drills. */
export function GrammarPart({ lesson }: { lesson: CourseLesson }) {
  const total = lesson.grammar.reduce((n, g) => n + g.drills.length, 0)
  // First attempt per drill decides whether its translate card starts as known or not.
  const [tried, setTried] = useState<Map<string, boolean>>(new Map())
  const [correct, setCorrect] = useState<Set<string>>(new Set())
  return (
    <div className="space-y-5">
      <PartTitle part="grammar" icon={BookOpen} title="Ngữ pháp & ghi chú" summary={`${lesson.grammar.length} điểm ngữ pháp`} />
      <Stagger className="space-y-5">
        {lesson.grammar.map((g, i) => (
          <Rise key={g.id}>
            <Point g={g} index={i} onDrill={(k, ok) => { setTried((t) => (t.has(k) ? t : new Map(t).set(k, ok))); if (ok) setCorrect((s) => new Set(s).add(k)) }} />
          </Rise>
        ))}
      </Stagger>
      {total > 0 && <div className="px-1">
        <PartBar part="grammar" label="Số câu luyện đã làm" value={total ? tried.size / total : 0} />
        <p className="mt-2 text-footnote text-secondary-label tabular-nums">
          Đã làm {tried.size}/{total} · trả lời đúng {correct.size}/{total}
        </p>
      </div>}
    </div>
  )
}
