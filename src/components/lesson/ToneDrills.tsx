import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { TONE_PAIRS, type TonePair } from '@/data/pronunciation'
import { Button, Card, Kbd } from '@/components/ui/Button'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { spring } from '@/components/ui/motion'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { shuffle } from '@/lib/shuffle'
import { speak } from '@/lib/speech'
import { useSettings } from '@/store/settings'

const TONE_NAME = ['', '1', '2', '3', '4', 'neutral']
const SHAKE = { x: [0, -6, 5, -3, 2, 0] }

/** Hear a two-syllable word, pick its tone combination on the 4×5 grid. */
export function TonePairDrill() {
  const rate = useSettings((s) => s.speechRate)
  const reduce = useReducedMotion()
  const [deck, setDeck] = useState(() => shuffle(TONE_PAIRS))
  const [pick, setPick] = useState<string | null>(null)
  const [score, setScore] = useState({ right: 0, total: 0 })
  const current = deck[0]
  const key = (p: TonePair) => p.tones.join('-')

  const next = () => {
    setPick(null)
    setDeck(deck.length > 1 ? deck.slice(1) : shuffle(TONE_PAIRS))
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && pick) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const isRight = pick === key(current)
  return (
    <div className="mt-6 space-y-4">
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SpeakButton text={current.hanzi} size="lg" />
            <SpeakButton text={current.hanzi} slow />
          </div>
          <div className="text-right">
            <p className="text-footnote text-secondary-label">Correct</p>
            <p className="text-title2 font-semibold leading-tight"><AnimatedNumber value={score.right} />
              <span className="text-secondary-label">/{score.total}</span></p>
            <p className="mt-0.5 text-caption text-tertiary-label"><Kbd>Space</Kbd> listen again</p>
          </div>
        </div>
        <h2 className="mt-4 text-headline">Which tone + which tone is this word?</h2>
        <p className="mt-1 text-subhead text-secondary-label">Listen, then pick the right cell in the table.</p>
        <div aria-live="polite" className="mt-3 min-h-12">
          {pick && (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className={`text-headline ${isRight ? 'text-success-text' : 'text-danger-text'}`}>{isRight ? 'Correct' : 'Not quite'}</span>
                <span lang="zh-CN" className="ml-3 font-han text-title2">{current.hanzi}</span> <Pinyin text={current.pinyin} className="text-callout" />
                <span className="text-subhead text-secondary-label"> · {current.vi}</span>
              </div>
              <Button onClick={next}>Next <Kbd>Enter</Kbd></Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-3 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[22rem] border-separate border-spacing-1.5">
            <caption className="sr-only">Pick the tone pair of the word you heard</caption>
            <thead>
              <tr>
                <th />
                {[1, 2, 3, 4, 5].map((b) => (
                  <th key={b} scope="col" className="text-caption font-semibold text-secondary-label">+ thanh {TONE_NAME[b]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((a) => (
                <tr key={a}>
                  <th scope="row" className="pr-1 text-right text-caption font-semibold text-secondary-label">thanh {a}</th>
                  {[1, 2, 3, 4, 5].map((b) => {
                    const p = TONE_PAIRS.find((x) => x.tones[0] === a && x.tones[1] === b)!
                    const k = key(p)
                    const answer = !!pick && k === key(current)
                    const wrong = pick === k && k !== key(current)
                    return (
                      <td key={b}>
                        <motion.button
                          type="button"
                          onClick={() => {
                            if (pick) return speak(p.hanzi, rate)
                            setPick(k)
                            setScore((s) => ({ right: s.right + (k === key(current) ? 1 : 0), total: s.total + 1 }))
                          }}
                          animate={wrong && !reduce ? SHAKE : { x: 0 }}
                          whileTap={{ scale: 0.94 }}
                          transition={wrong ? { duration: 0.35 } : spring.snappy}
                          className={`min-h-12 w-full cursor-pointer rounded-full px-1 py-2 text-center ${answer ? 'bg-success-soft text-success-text' : wrong ? 'bg-danger-soft text-danger-text' : 'bg-fill text-label'}`}
                        >
                          <span className="block font-mono text-subhead font-semibold tabular-nums">{a}–{TONE_NAME[b]}</span>
                          {pick && <span className="mt-0.5 hidden text-caption sm:block"><span lang="zh-CN" className="font-han">{p.hanzi}</span> <Pinyin text={p.pinyin} plain /></span>}
                        </motion.button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-footnote text-secondary-label">After answering, tap any cell to hear an example of that pair and compare.</p>
    </div>
  )
}
