import { useEffect, useState } from 'react'
import { TONE_PAIRS, type TonePair } from '@/data/pronunciation'
import { Button, Card, Kbd } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { shuffle } from '@/lib/shuffle'
import { speak } from '@/lib/speech'
import { useSettings } from '@/store/settings'

const TONE_NAME = ['', '1', '2', '3', '4', 'nhẹ']

/** Hear a two-syllable word, pick its tone combination on the 4×5 grid. */
export function TonePairDrill() {
  const rate = useSettings((s) => s.speechRate)
  const [deck, setDeck] = useState(() => shuffle(TONE_PAIRS))
  const [pick, setPick] = useState<string | null>(null)
  const [score, setScore] = useState({ right: 0, total: 0 })
  const current = deck[0]
  const key = (p: TonePair) => p.tones.join('-')

  useEffect(() => {
    const t = setTimeout(() => speak(current.hanzi, rate), 250)
    return () => clearTimeout(t)
  }, [current, rate])

  const next = () => {
    setPick(null)
    setDeck(deck.length > 1 ? deck.slice(1) : shuffle(TONE_PAIRS))
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && pick) next()
      if (e.code === 'Space') {
        e.preventDefault()
        speak(current.hanzi, rate)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="mt-6 space-y-5">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SpeakButton text={current.hanzi} size="lg" />
            <SpeakButton text={current.hanzi} slow />
          </div>
          <div className="text-right text-sm text-muted">
            {score.total > 0 && (
              <>
                Đúng <b className="text-ink">{score.right}</b>/{score.total} ({Math.round((score.right / score.total) * 100)}%)
              </>
            )}
            <div>
              <Kbd>Space</Kbd> nghe lại
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">Từ này gồm thanh nào + thanh nào? Chọn ô đúng trong bảng.</p>
        {pick && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <span className={`font-semibold ${pick === key(current) ? 'text-jade' : 'text-cinnabar'}`}>{pick === key(current) ? 'Đúng' : 'Chưa đúng'}</span>
              <span className="font-han text-2xl ml-3">{current.hanzi}</span> <Pinyin text={current.pinyin} className="text-lg" />
              <span className="text-muted"> · {current.vi}</span>
            </div>
            <Button onClick={next}>
              Tiếp <Kbd>Enter</Kbd>
            </Button>
          </div>
        )}
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1.5">
          <thead>
            <tr>
              <th />
              {[1, 2, 3, 4, 5].map((b) => (
                <th key={b} className="text-[11px] font-semibold text-muted">
                  + thanh {TONE_NAME[b]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((a) => (
              <tr key={a}>
                <th className="text-[11px] font-semibold text-muted pr-1 text-right">thanh {a}</th>
                {[1, 2, 3, 4, 5].map((b) => {
                  const p = TONE_PAIRS.find((x) => x.tones[0] === a && x.tones[1] === b)!
                  const k = key(p)
                  const answer = pick && k === key(current)
                  const wrong = pick === k && k !== key(current)
                  return (
                    <td key={b}>
                      <button
                        onClick={() => {
                          if (pick) return speak(p.hanzi, rate)
                          setPick(k)
                          setScore((s) => ({ right: s.right + (k === key(current) ? 1 : 0), total: s.total + 1 }))
                        }}
                        className={`w-full rounded-xl border px-1 sm:px-2 py-2.5 text-center cursor-pointer transition ${
                          answer ? 'border-jade bg-jade-soft' : wrong ? 'border-cinnabar bg-cinnabar-soft' : 'border-line bg-surface hover:bg-sunken'
                        }`}
                      >
                        <div className="font-mono text-sm font-semibold">
                          {a}–{TONE_NAME[b]}
                        </div>
                        {pick && (
                          <div className="text-xs mt-0.5 hidden sm:block">
                            <span className="font-han">{p.hanzi}</span> <Pinyin text={p.pinyin} />
                          </div>
                        )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">Sau khi trả lời, bấm vào ô bất kỳ để nghe từ mẫu của tổ hợp đó và so sánh.</p>
    </div>
  )
}
