import { useEffect, useRef, useState } from 'react'
import { PRONUNCIATION_UNITS } from '@/data/pronunciationLearning'
import { markPart } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { RULES } from '@/data/pinyinRules'
import { Button, Card, Kbd } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { PinyinInput } from '@/components/hanzi/PinyinInput'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { getTone, marksToNumbers, numbersToMarks, PINYIN_WORD, splitSyllables, TONE_INFO } from '@/lib/pinyin'
import { shuffle } from '@/lib/shuffle'
import { speak } from '@/lib/speech'
import { useSettings } from '@/store/settings'
import { PracticePool } from './PracticePool'
import type { PracticeWord } from '@/lib/practicePool'

/** Reading and spelling rules, each with examples you can tap to hear. */
export function PinyinRules() {
  const rate = useSettings((s) => s.speechRate)
  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-muted">
        These rules explain why pinyin is spelled and read the way it is. Tap an example to hear it. You don't need to learn them all now; come back when a sound puzzles you.
      </p>
      {RULES.map((r, i) => (
        <Card key={r.id} className="p-5">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-bold tabular-nums text-muted">{i + 1}</span>
            <h2 className="font-bold">{r.title}</h2>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed">{r.body}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {r.examples.map((ex) => (
              <button
                key={ex.pinyin + ex.hanzi}
                onClick={() => speak(ex.hanzi, rate)}
                className="rounded-xl border border-line bg-surface px-3 py-2 text-left cursor-pointer transition hover:bg-sunken"
              >
                <div className="flex items-baseline gap-2">
                  <Pinyin text={ex.pinyin} className="text-lg" />
                  <span className="font-han">{ex.hanzi}</span>
                </div>
                {ex.note && <div className="mt-0.5 text-xs text-muted">{ex.note}</div>}
              </button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

const TYPING_EXAMPLES = ['nǐ hǎo', 'Zhōngguó', 'xièxie', 'nǚ', 'lǜ', "nǚ'ér", 'nǎr', 'Hànyǔ']

function Playground() {
  const [v, setV] = useState('')
  const out = numbersToMarks(v).replace(/v/g, 'ü')
  const chips = (out.match(new RegExp(PINYIN_WORD.source, 'g')) ?? []).flatMap((w) => splitSyllables(w))
  return (
    <div>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Try typing here, e.g. zhong1guo2 or nv3"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-xl outline-none focus:border-ink"
      />
      <div className="mt-3 min-h-16">
        {out ? (
          <>
            <Pinyin text={out} className="text-3xl" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {chips.map((c, i) => (
                <span key={i} className="rounded-lg bg-sunken px-2 py-1 text-xs">
                  <Pinyin text={c} className="text-sm" /> · {TONE_INFO[getTone(c)].name}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">The result appears here, with tone marks and a colour for each tone.</p>
        )}
      </div>
    </div>
  )
}

function Trainer({ onCorrect }: { onCorrect: () => void }) {
  return <PracticePool>{(pool) => <TypingDeck pool={pool} onCorrect={onCorrect} />}</PracticePool>
}

function TypingDeck({ pool, onCorrect }: { pool: PracticeWord[]; onCorrect: () => void }) {
  const [deck, setDeck] = useState(() => shuffle(pool))
  const [answered, setAnswered] = useState(false)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState({ right: 0, total: 0 })
  const cur = deck[0]

  const next = () => {
    setAnswered(false)
    setRound((r) => r + 1)
    setDeck(deck.length > 1 ? deck.slice(1) : shuffle(pool))
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && answered && !(e.target instanceof HTMLInputElement)) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div key={round}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="font-han text-4xl">{cur.hanzi}</span>
            <SpeakButton text={cur.hanzi} size="sm" />
          </div>
          <div className="mt-1">
            <Pinyin text={cur.pinyin} className="text-2xl" /> <span className="text-muted">· {cur.vi}</span>
          </div>
        </div>
        {score.total > 0 && (
          <span className="text-sm text-muted">
            Correct <b className="text-ink">{score.right}</b>/{score.total}
          </span>
        )}
      </div>
      <p className="mb-3 mt-4 text-sm text-muted">Type the pinyin above using tone numbers.</p>
      <PinyinInput
        size="md"
        autoFocus={false}
        expected={[cur.pinyin, ...cur.alts]}
        onResult={(v) => {
          setAnswered(true)
          if (v === 'correct') onCorrect()
          setScore((s) => ({ right: s.right + (v === 'correct' ? 1 : 0), total: s.total + 1 }))
        }}
      />
      {answered && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm">
            Typed as: <code className="rounded bg-sunken px-1.5 py-0.5 font-mono">{marksToNumbers(cur.pinyin)}</code>
          </span>
          <Button onClick={next}>
            Next <Kbd>Enter</Kbd>
          </Button>
        </div>
      )}
    </div>
  )
}

const IME = [
  {
    os: 'Mac',
    steps: 'System Settings → Keyboard → Text Input → Input Sources → Edit… → + → Chinese, Simplified → Pinyin - Simplified. Switch keyboards with 🌐 or Control + Space.',
  },
  {
    os: 'Windows',
    steps: 'Settings → Time & language → Language & region → Add a language → Chinese (Simplified, China) → Microsoft Pinyin. Switch keyboards with Windows + Space.',
  },
  {
    os: 'iPhone / Android',
    steps: 'iPhone: Settings → General → Keyboard → Keyboards → Add New Keyboard → Chinese, Simplified → Pinyin - QWERTY. Android (Gboard): Settings → Languages → add Chinese (Simplified) → Pinyin. Menu names may differ slightly by version.',
  },
]

export function TypingGuide() {
  const unit = PRONUNCIATION_UNITS[5]
  const { lessonState } = useStudyData()
  const lock = useRef(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const saveProgress = async () => {
    if (lock.current || saved || lessonState.get(unit.id)?.done.dialogue) return
    lock.current = true; setError('')
    try { await markPart(unit.id, 'dialogue'); setSaved(true) }
    catch { setError('Couldn\'t save your typing progress.') }
    finally { lock.current = false }
  }
  return (
    <div className="mt-6 space-y-6">
      <Card className="p-6">
        <h2 className="font-bold">1. Typing pinyin in this app</h2>
        <p className="mt-2 text-[15px] leading-relaxed">
          You don't need a special keyboard. Type the letters of the syllable, then add <b>one digit</b> for the tone: <b>1</b> = tone 1, <b>2</b> = tone 2, <b>3</b> = tone 3, <b>4</b> = tone 4. A neutral-tone
          syllable needs <b>no number</b>. Type <b>ü</b> as <b>v</b>. You can type syllables together or apart: <code className="rounded bg-sunken px-1 font-mono">zhong1guo2</code> and{' '}
          <code className="rounded bg-sunken px-1 font-mono">zhong1 guo2</code> both work.
        </p>
        <div className="mt-4 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
          {TYPING_EXAMPLES.map((p) => (
            <div key={p} className="flex items-baseline justify-between gap-3 border-b border-line py-1.5">
              <Pinyin text={p} className="text-lg" />
              <code className="font-mono text-muted">{marksToNumbers(p)}</code>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          If the letters are right but a number is wrong or missing, the app tells you the tone is off. Typing with marks (nǐ hǎo) also works if you paste from elsewhere.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="font-bold">2. Try it</h2>
        <p className="mb-4 mt-1 text-sm text-muted">Type any syllable to see how the app turns it into pinyin with tone marks.</p>
        <Playground />
      </Card>

      <Card id="typing-practice" className="p-6">
        <h2 className="font-bold">3. Typing practice</h2>
        <p className="mb-4 mt-1 text-sm text-muted">Look at the pinyin with marks and type it back with numbers. A few minutes a day builds the habit.</p>
        <div className="mb-4 rounded-xl bg-sunken p-3 text-sm leading-relaxed">
          <ul className="list-disc space-y-1 pl-5">{unit.steps.map(note => <li key={note}>{note}</li>)}</ul>
        </div>
        <Trainer onCorrect={() => { void saveProgress() }} />
        {error && <div className="mt-3"><p role="alert" className="text-sm text-cinnabar">{error}</p><Button variant="secondary" className="mt-2" onClick={() => { void saveProgress() }}>Try saving again</Button></div>}
      </Card>

      <Card className="p-6">
        <h2 className="font-bold">4. Typing real characters on your computer and phone</h2>
        <p className="mt-2 text-[15px] leading-relaxed">
          Unlike this app, when you text or write in Chinese you type pinyin <b>WITHOUT tones</b>. Type <code className="rounded bg-sunken px-1 font-mono">nihao</code>, the keyboard shows
          a list of characters, and you press a number or <Kbd>Space</Kbd> to pick <span className="font-han text-lg">你好</span>. Typing a whole phrase (<code className="rounded bg-sunken px-1 font-mono">woxianghecha</code>) lets it
          guess more accurately than one character at a time. Turn on a Chinese keyboard once:
        </p>
        <div className="mt-4 space-y-3">
          {IME.map((i) => (
            <div key={i.os} className="rounded-xl bg-sunken p-4">
              <div className="text-sm font-bold">{i.os}</div>
              <p className="mt-1 text-sm leading-relaxed">{i.steps}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">Typing characters every day is also a good way to learn to recognise them, because you have to pick the right one from the list.</p>
      </Card>
    </div>
  )
}
