import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { WORDS } from '@/data/course'
import { Button, Card, Kbd } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { PinyinInput } from '@/components/hanzi/PinyinInput'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { StrokeWriter } from '@/components/hanzi/StrokeWriter'
import { WordCard } from '@/components/hanzi/WordCard'
import { RatingBar } from '@/components/srs/RatingBar'
import { charInfo } from '@/lib/chars'
import { SENTENCES, TRANSLATIONS, type SentenceEntry } from '@/lib/sentences'
import { db, type StoredCard } from '@/lib/db'
import type { PinyinVerdict } from '@/lib/pinyin'
import { speak } from '@/lib/speech'
import { dueCards, grade, Rating, type Grade } from '@/lib/srs'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { useSettings } from '@/store/settings'

const KIND_LABEL: Record<StoredCard['kind'], string> = {
  recall: 'Nhớ lại cách đọc',
  read: 'Nhận mặt chữ',
  listen: 'Nghe hiểu từ',
  write: 'Viết chữ',
  sentence: 'Nghe hiểu câu',
  translate: 'Dịch sang tiếng Trung',
}

function RecallCard({ card, onDone }: { card: StoredCard; onDone: (g: Grade) => void }) {
  const entry = WORDS.get(card.ref)!
  const [verdict, setVerdict] = useState<PinyinVerdict | null>(null)
  const [override, setOverride] = useState(false)
  const rate = useSettings((s) => s.speechRate)
  const w = entry.word

  const ok = verdict === 'correct' || override
  return (
    <>
      <div className="text-center py-6">
        <div className="text-2xl sm:text-3xl font-semibold">{w.meaning}</div>
        <div className="text-muted mt-1">{w.pos}</div>
      </div>
      <PinyinInput
        expected={[w.pinyin, ...(w.alts ?? [])]}
        onResult={(v) => {
          setVerdict(v)
          speak(w.hanzi, rate)
        }}
      />
      {verdict && (
        <div className="mt-6 space-y-5">
          <Card className="p-5">
            <WordCard word={w} compact />
          </Card>
          {!ok && (
            <button className="text-sm text-muted underline cursor-pointer" onClick={() => setOverride(true)}>
              Tôi gõ nhầm, thật ra tôi nhớ đúng
            </button>
          )}
          <RatingBar
            card={card}
            onRate={onDone}
            allowed={ok ? undefined : [Rating.Again]}
            suggested={ok ? Rating.Good : Rating.Again}
          />
        </div>
      )}
    </>
  )
}

function ReadCard({ card, onDone }: { card: StoredCard; onDone: (g: Grade) => void }) {
  const w = WORDS.get(card.ref)!.word
  const [shown, setShown] = useState(false)
  return <>
    <div className="text-center py-8"><div className="font-han text-6xl break-all">{w.hanzi}</div><p className="mt-4 text-sm text-muted">Tự đọc và nhớ nghĩa của từ này, rồi đối chiếu đáp án.</p></div>
    {!shown ? <Button className="w-full" onClick={() => setShown(true)}>Hiện cách đọc và nghĩa</Button> : <div className="space-y-5"><Card className="p-5"><WordCard word={w} compact /></Card><p className="text-sm text-muted">Chọn “Nhớ” khi bạn đã nhớ được cả nghĩa và cách đọc trước khi xem đáp án.</p><RatingBar card={card} onRate={onDone} suggested={Rating.Good} /></div>}
  </>
}

function ListenCard({ card, onDone }: { card: StoredCard; onDone: (g: Grade) => void }) {
  const w = WORDS.get(card.ref)!.word
  const [shown, setShown] = useState(false)
  const rate = useSettings((s) => s.speechRate)
  useEffect(() => {
    const t = setTimeout(() => speak(w.hanzi, rate), 250)
    return () => clearTimeout(t)
  }, [w, rate])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!shown && (e.code === 'Space' || e.key === 'Enter')) {
        e.preventDefault()
        setShown(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shown])

  return (
    <>
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="flex items-center gap-3">
          <SpeakButton text={w.hanzi} size="lg" />
          <SpeakButton text={w.hanzi} slow />
        </div>
        <p className="text-muted text-sm">Nghe và tự nói ra nghĩa trong đầu, rồi mới lật đáp án.</p>
      </div>
      {!shown ? (
        <Button className="w-full" onClick={() => setShown(true)}>
          Hiện đáp án <Kbd>Space</Kbd>
        </Button>
      ) : (
        <div className="space-y-5">
          <Card className="p-5">
            <WordCard word={w} compact />
          </Card>
          <RatingBar card={card} onRate={onDone} suggested={Rating.Good} />
        </div>
      )}
    </>
  )
}

function WriteCard({ card, onDone }: { card: StoredCard; onDone: (g: Grade) => void }) {
  const info = charInfo(card.ref)
  const [mistakes, setMistakes] = useState<number | null>(null)
  const [gaveUp, setGaveUp] = useState(false)
  const first = info.words[0]?.word
  const suggested = gaveUp ? Rating.Again : mistakes === null ? undefined : mistakes === 0 ? Rating.Good : mistakes <= 3 ? Rating.Hard : Rating.Again

  return (
    <>
      <div className="text-center py-4">
        <Pinyin text={info.pinyin} className="text-2xl" />
        <div className="text-muted mt-1">
          trong <span className="font-semibold text-ink">{first?.meaning}</span>
          {first && first.hanzi.length > 1 && (
            <>
              {' '}
              · <span className="font-han">{first.hanzi.replace(card.ref, '＿')}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <StrokeWriter key={gaveUp ? 'show' : 'quiz'} char={card.ref} mode={gaveUp ? 'animate' : 'recall'} onComplete={setMistakes} />
      </div>
      <div className="mt-5 space-y-3">
        {mistakes === null && !gaveUp ? (
          <Button variant="ghost" className="w-full" onClick={() => setGaveUp(true)}>
            Tôi không nhớ, cho xem chữ
          </Button>
        ) : (
          <>
            {!gaveUp && <p className="text-center text-sm text-muted">{mistakes === 0 ? 'Viết đúng toàn bộ nét.' : `${mistakes} nét sai.`}</p>}
            <RatingBar card={card} onRate={onDone} suggested={suggested} />
          </>
        )}
      </div>
    </>
  )
}

function hasContent(c: StoredCard) {
  if (c.kind === 'recall' || c.kind === 'listen' || c.kind === 'read') return WORDS.has(c.ref)
  if (c.kind === 'write') return charInfo(c.ref).words.length > 0
  return (c.kind === 'sentence' ? SENTENCES : TRANSLATIONS).has(c.ref)
}

function SentenceAnswer({ s }: { s: SentenceEntry }) {
  return (
    <Card className="p-5 flex items-start gap-3">
      <SpeakButton text={s.hanzi} size="sm" />
      <div>
        <div className="font-han text-2xl">{s.hanzi}</div>
        <Pinyin text={s.pinyin} />
        <div className="text-muted mt-1">{s.vi}</div>
      </div>
    </Card>
  )
}

function SentenceCard({ card, onDone }: { card: StoredCard; onDone: (g: Grade) => void }) {
  const s = SENTENCES.get(card.ref)!
  const [shown, setShown] = useState(false)
  const rate = useSettings((st) => st.speechRate)
  useEffect(() => {
    const t = setTimeout(() => speak(s.hanzi, rate), 250)
    return () => clearTimeout(t)
  }, [s, rate])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!shown && (e.code === 'Space' || e.key === 'Enter')) {
        e.preventDefault()
        setShown(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shown])
  return (
    <>
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="flex items-center gap-3">
          <SpeakButton text={s.hanzi} size="lg" />
          <SpeakButton text={s.hanzi} slow />
        </div>
        <p className="text-muted text-sm text-center">Nghe cả câu và tự dịch trong đầu. Chỉ chấm "Nhớ" nếu bạn hiểu được hết câu.</p>
      </div>
      {!shown ? (
        <Button className="w-full" onClick={() => setShown(true)}>
          Hiện đáp án <Kbd>Space</Kbd>
        </Button>
      ) : (
        <div className="space-y-5">
          <SentenceAnswer s={s} />
          <RatingBar card={card} onRate={onDone} suggested={Rating.Good} />
        </div>
      )}
    </>
  )
}

function TranslateCard({ card, onDone }: { card: StoredCard; onDone: (g: Grade) => void }) {
  const s = TRANSLATIONS.get(card.ref)!
  const [verdict, setVerdict] = useState<PinyinVerdict | null>(null)
  const [override, setOverride] = useState(false)
  const rate = useSettings((st) => st.speechRate)
  const ok = verdict === 'correct' || override
  return (
    <>
      <div className="text-center py-6">
        <div className="text-2xl font-semibold">“{s.vi}”</div>
        <div className="text-muted mt-1 text-sm">Nói câu này bằng tiếng Trung, gõ bằng pinyin</div>
      </div>
      <PinyinInput
        size="md"
        expected={s.pinyin}
        placeholder="Gõ cả câu bằng pinyin…"
        onResult={(v) => {
          setVerdict(v)
          speak(s.hanzi, rate)
        }}
      />
      {verdict && (
        <div className="mt-4 space-y-5">
          <SentenceAnswer s={s} />
          {!ok && (
            <button className="text-sm text-muted underline cursor-pointer" onClick={() => setOverride(true)}>
              Câu của tôi cũng đúng (cách diễn đạt khác)
            </button>
          )}
          <RatingBar card={card} onRate={onDone} allowed={ok ? undefined : [Rating.Again]} suggested={ok ? Rating.Good : Rating.Again} />
        </div>
      )}
    </>
  )
}

export function ReviewPage() {
  useStudyTimer()
  const [queue, setQueue] = useState<StoredCard[] | null>(null)
  const [done, setDone] = useState({ total: 0, again: 0 })
  const started = useRef(Date.now())
  const lock = useRef(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [nextDue, setNextDue] = useState<number | null>(null)
  const [clock, setClock] = useState(Date.now())

  useEffect(() => {
    if (queue?.length) return
    let active = true
    const refresh = async () => {
      try {
        const ready = (await dueCards()).filter(hasContent)
        const upcoming = (await db.cards.where('due').above(new Date()).toArray()).filter(hasContent)
        if (!active) return
        setQueue(ready)
        setNextDue(upcoming.length ? Math.min(...upcoming.map((c) => c.due.getTime())) : null)
        setClock(Date.now())
        setError('')
      } catch { if (active) setError('Chưa tải được lịch ôn. Hãy tải lại trang để thử lại.') }
    }
    refresh()
    const timer = setInterval(refresh, 5000)
    return () => { active = false; clearInterval(timer) }
  }, [queue?.length])

  const onDone = useCallback(
    async (g: Grade) => {
      if (!queue?.length || lock.current) return
      lock.current = true
      setBusy(true)
      setError('')
      const [current, ...rest] = queue
      try {
        const next = await grade(current, g)
        setDone((d) => ({ total: d.total + 1, again: d.again + (g === Rating.Again ? 1 : 0) }))
        setQueue(next.due.getTime() <= Date.now() ? [...rest, next] : rest)
      } catch { setError('Chưa lưu được kết quả. Hãy chấm lại thẻ này.'); }
      finally { lock.current = false; setBusy(false) }
    },
    [queue],
  )

  if (!queue) return <p role={error ? 'alert' : 'status'} className="pt-8">{error || 'Đang tải thẻ ôn…'}</p>
  const current = queue[0]

  if (!current) {
    const mins = Math.max(1, Math.round((Date.now() - started.current) / 60_000))
    return (
      <div className="max-w-xl mx-auto pt-16 text-center">
        <div className="font-han text-6xl text-jade">毕</div>
        <h1 className="text-2xl font-bold mt-4">{done.total ? 'Đã ôn xong các thẻ đang đến hạn' : 'Không có thẻ nào đến hạn'}</h1>
        {done.total > 0 && (
          <p className="text-muted mt-2">
            {done.total} lượt ôn · nhớ được {Math.round(((done.total - done.again) / done.total) * 100)}% · khoảng {mins} phút
          </p>
        )}
        <p className="text-muted mt-2 text-sm">Thẻ nào bạn quên sẽ quay lại sớm. Thẻ nhớ tốt sẽ giãn ra vài ngày, rồi vài tuần.</p>
        {nextDue && <p role="status" className="mt-4 rounded-xl bg-jade-soft p-4 text-sm">Lượt ôn tiếp theo sau khoảng {Math.max(1, Math.ceil((nextDue - clock) / 60_000))} phút. Bạn có thể nghỉ hoặc học tiếp; thẻ sẽ xuất hiện khi đến giờ.</p>}
        {error && <p role="alert" className="mt-3 text-cinnabar">{error}</p>}
        <div className="flex justify-center gap-3 mt-8">
          <Link to="/">
            <Button>Về trang Hôm nay</Button>
          </Link>
          <Link to="/course">
            <Button variant="secondary">Học bài mới</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto pt-6">
      <div className="flex items-center justify-between text-sm text-muted mb-4">
        <span className="font-semibold text-ink">{KIND_LABEL[current.kind]}</span>
        <span>
          còn <b className="text-ink tabular-nums">{queue.length}</b> thẻ · đã ôn {done.total}
        </span>
      </div>
      <div className="h-1 rounded-full bg-line overflow-hidden mb-6">
        <div className="h-full bg-ink transition-all" style={{ width: `${(done.total / (done.total + queue.length)) * 100}%` }} />
      </div>
      {error && <p role="alert" className="mb-4 text-cinnabar">{error}</p>}
      {busy && <p role="status" className="mb-3 text-sm text-muted">Đang lưu kết quả…</p>}
      <fieldset disabled={busy} key={`${current.id}-${done.total}`}>
        {current.kind === 'recall' && <RecallCard card={current} onDone={onDone} />}
        {current.kind === 'read' && <ReadCard card={current} onDone={onDone} />}
        {current.kind === 'listen' && <ListenCard card={current} onDone={onDone} />}
        {current.kind === 'write' && <WriteCard card={current} onDone={onDone} />}
        {current.kind === 'sentence' && <SentenceCard card={current} onDone={onDone} />}
        {current.kind === 'translate' && <TranslateCard card={current} onDone={onDone} />}
      </fieldset>
    </div>
  )
}
