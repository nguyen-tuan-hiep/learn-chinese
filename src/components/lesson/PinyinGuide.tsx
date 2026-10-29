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
        Những quy tắc này giải thích vì sao pinyin viết như vậy và đọc như vậy. Chạm vào ví dụ để nghe. Bạn không cần thuộc hết ngay, hãy quay lại khi gặp âm lạ.
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
        placeholder="Thử gõ ở đây, ví dụ: zhong1guo2 hoặc nv3"
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
          <p className="text-sm text-muted">Kết quả sẽ hiện ở đây, kèm dấu thanh và màu của từng thanh điệu.</p>
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
            Đúng <b className="text-ink">{score.right}</b>/{score.total}
          </span>
        )}
      </div>
      <p className="mb-3 mt-4 text-sm text-muted">Gõ lại pinyin trên bằng số thanh điệu.</p>
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
            Cách gõ: <code className="rounded bg-sunken px-1.5 py-0.5 font-mono">{marksToNumbers(cur.pinyin)}</code>
          </span>
          <Button onClick={next}>
            Tiếp <Kbd>Enter</Kbd>
          </Button>
        </div>
      )}
    </div>
  )
}

const IME = [
  {
    os: 'Mac',
    steps: 'System Settings → Keyboard → Text Input → Input Sources → Edit… → dấu + → Chinese, Simplified → Pinyin - Simplified. Chuyển bàn phím bằng phím 🌐 hoặc Control + Space.',
  },
  {
    os: 'Windows',
    steps: 'Settings → Time & language → Language & region → Add a language → Chinese (Simplified, China) → Microsoft Pinyin. Chuyển bàn phím bằng Windows + Space.',
  },
  {
    os: 'iPhone / Android',
    steps: 'iPhone: Settings → General → Keyboard → Keyboards → Add New Keyboard → Chinese, Simplified → Pinyin - QWERTY. Android (Gboard): Settings → Languages → thêm Chinese (Simplified) → Pinyin. Tên menu có thể khác đôi chút theo phiên bản.',
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
    catch { setError('Chưa lưu được tiến độ luyện gõ.') }
    finally { lock.current = false }
  }
  return (
    <div className="mt-6 space-y-6">
      <Card className="p-6">
        <h2 className="font-bold">1. Gõ pinyin trong app này</h2>
        <p className="mt-2 text-[15px] leading-relaxed">
          Bạn không cần bàn phím đặc biệt. Gõ chữ cái của âm tiết rồi thêm <b>một chữ số</b> cho thanh điệu: <b>1</b> = thanh 1, <b>2</b> = thanh 2, <b>3</b> = thanh 3, <b>4</b> = thanh 4. Âm tiết
          đọc nhẹ thì <b>không cần số</b>. Chữ <b>ü</b> gõ là <b>v</b>. Có thể gõ liền hoặc cách ra: <code className="rounded bg-sunken px-1 font-mono">zhong1guo2</code> và{' '}
          <code className="rounded bg-sunken px-1 font-mono">zhong1 guo2</code> đều được.
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
          Gõ đúng chữ cái nhưng sai hoặc thiếu số, app báo "Đúng âm, sai thanh điệu". Gõ cả dấu (nǐ hǎo) cũng được nếu bạn dán từ nơi khác.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="font-bold">2. Thử gõ</h2>
        <p className="mb-4 mt-1 text-sm text-muted">Gõ thử bất kỳ âm tiết nào để xem app đổi thành pinyin có dấu thế nào.</p>
        <Playground />
      </Card>

      <Card id="typing-practice" className="p-6">
        <h2 className="font-bold">3. Luyện gõ</h2>
        <p className="mb-4 mt-1 text-sm text-muted">Nhìn pinyin có dấu, gõ lại bằng số. Làm vài phút mỗi ngày là quen tay.</p>
        <div className="mb-4 rounded-xl bg-sunken p-3 text-sm leading-relaxed">
          <ul className="list-disc space-y-1 pl-5">{unit.steps.map(note => <li key={note}>{note}</li>)}</ul>
        </div>
        <Trainer onCorrect={() => { void saveProgress() }} />
        {error && <div className="mt-3"><p role="alert" className="text-sm text-cinnabar">{error}</p><Button variant="secondary" className="mt-2" onClick={() => { void saveProgress() }}>Thử lưu lại</Button></div>}
      </Card>

      <Card className="p-6">
        <h2 className="font-bold">4. Gõ chữ Hán thật trên máy tính và điện thoại</h2>
        <p className="mt-2 text-[15px] leading-relaxed">
          Khác với app này, khi nhắn tin hay viết bài bằng tiếng Trung bạn gõ pinyin <b>KHÔNG cần thanh điệu</b>. Ví dụ gõ <code className="rounded bg-sunken px-1 font-mono">nihao</code>, máy hiện
          danh sách chữ, bạn bấm số hoặc <Kbd>Space</Kbd> để chọn <span className="font-han text-lg">你好</span>. Gõ cả cụm (<code className="rounded bg-sunken px-1 font-mono">woxianghecha</code>) thì máy
          đoán chữ chính xác hơn gõ từng chữ. Bạn cần bật bộ gõ tiếng Trung một lần:
        </p>
        <div className="mt-4 space-y-3">
          {IME.map((i) => (
            <div key={i.os} className="rounded-xl bg-sunken p-4">
              <div className="text-sm font-bold">{i.os}</div>
              <p className="mt-1 text-sm leading-relaxed">{i.steps}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">Gõ thử ra chữ Hán mỗi ngày cũng là cách tốt để nhận mặt chữ, vì bạn phải chọn đúng chữ trong danh sách.</p>
      </Card>
    </div>
  )
}
