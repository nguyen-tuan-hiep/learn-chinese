import { useState } from 'react'
import { RULES } from '@/data/pinyinRules'
import { Card, Kbd } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { getTone, marksToNumbers, numbersToMarks, PINYIN_WORD, splitSyllables, TONE_INFO } from '@/lib/pinyin'
import { speak } from '@/lib/speech'
import { useSettings } from '@/store/settings'

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
                className="rounded-xl glass-thin px-3 py-2 text-left cursor-pointer transition hover:bg-sunken"
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
        className="w-full rounded-xl glass-thin px-4 py-3 text-xl outline-none focus:border-ink"
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


      <Card className="p-6">
        <h2 className="font-bold">3. Typing real characters on your computer and phone</h2>
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
