import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { wordKey } from '@/data/course'
import type { CourseLesson, Word } from '@/data/types'
import { Button, Card, Kbd } from '@/components/ui/Button'
import { PinyinInput } from '@/components/hanzi/PinyinInput'
import { WordCard } from '@/components/hanzi/WordCard'
import { shuffle } from '@/lib/shuffle'
import { introduce } from '@/lib/srs'
import { useStudyData } from '@/lib/useStudyData'
import { SpeakButton } from '@/components/hanzi/SpeakButton'

type Phase = 'study' | 'practice' | 'listen' | 'done'

/** Resume with the lesson's unseen words, or review the whole lesson when all are learned. */
export function VocabPart({ lesson, onComplete }: { lesson: CourseLesson; onComplete: () => void }) {
  const { loaded, cards } = useStudyData()
  const plan = useRef<Word[] | null>(null)
  if (!loaded) return <p role="status">Đang tải từ vựng…</p>
  const learned = new Set(cards.filter((c) => c.kind === 'recall').map((c) => c.ref))
  plan.current ??= lesson.words.filter((w) => !learned.has(wordKey(lesson, w)))
  const unseen = plan.current
  return <VocabSession lesson={lesson} onComplete={onComplete} words={unseen.length ? unseen : lesson.words} reviewing={!unseen.length} />
}

function VocabSession({ lesson, words, reviewing, onComplete }: { lesson: CourseLesson; words: Word[]; reviewing: boolean; onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('study')
  const [i, setI] = useState(0)
  const [recallResult, setRecallResult] = useState(new Set<string>())
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)

  useEffect(() => {
    if (phase !== 'study') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && i < words.length - 1) setI(i + 1)
      if (e.key === 'ArrowLeft' && i > 0) setI(i - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [i, phase, words])

  const finish = async (listening: Set<string>) => {
    if (savingRef.current) return
    savingRef.current = true
    setSaving(true)
    setError('')
    try {
      await introduce(words.flatMap((w) => [
        { kind: 'recall' as const, ref: wordKey(lesson, w), lessonId: lesson.id, firstTry: recallResult.has(w.id) },
        { kind: 'listen' as const, ref: wordKey(lesson, w), lessonId: lesson.id, firstTry: listening.has(w.id) },
        // Reading has not been tested yet: introduce it without assuming success.
        { kind: 'read' as const, ref: wordKey(lesson, w), lessonId: lesson.id, firstTry: null },
      ]))
      await onComplete()
      setPhase('done')
    } catch { setError('Chưa lưu được kết quả. Hãy thử lại.'); }
    finally { savingRef.current = false; setSaving(false) }
  }

  if (phase === 'practice') return <Practice words={words} onFinish={(result) => { setRecallResult(new Set(result)); setPhase('listen') }} />
  if (phase === 'listen') return <div className="space-y-4"><ListeningPractice words={words} onFinish={finish} saving={saving} />{error && <p role="alert" className="text-cinnabar">{error}</p>}</div>
  if (phase === 'done') return <Card className="p-6">
    <h2 className="font-semibold">{reviewing ? 'Đã luyện lại' : 'Đã lưu'} {words.length} từ</h2>
    <p className="text-sm text-muted mt-2">Bạn đã luyện nhớ cách đọc và nghe hiểu riêng. Các thẻ nhận mặt chữ sẽ bắt đầu khi bạn ôn tập.</p>
    <p className="text-sm text-muted mt-2">Bạn đã học hết từ của bài. Hãy tiếp tục với các phần còn lại.</p>
    <Link to={`/lesson/${lesson.id}`} className="inline-block mt-4 underline font-semibold">Tiếp tục bài học →</Link>
  </Card>

  return <div>
    <div className="mb-4 rounded-xl bg-jade-soft px-4 py-3 text-sm">
      <p className="font-semibold">Bài này có {lesson.words.length} từ vựng · lượt này {reviewing ? 'ôn' : 'học'} {words.length} từ</p>
      <p className="mt-1 text-muted">Mỗi từ hoặc cụm từ trong danh sách có thể gồm một hay nhiều chữ Hán. Ví dụ: 对不起 (xin lỗi) gồm 3 chữ: 对, 不, 起. Bạn học nghĩa và cách đọc ở đây; nhận diện các bộ xuất hiện trong chữ ở tab Bộ thủ.</p>
    </div>
    <div className="flex items-center justify-between text-sm text-muted mb-3"><span>Từ {i + 1}/{words.length}</span><span className="hidden sm:inline"><Kbd>←</Kbd> <Kbd>→</Kbd> để chuyển</span></div>
    <Card className="p-5 sm:p-8"><WordCard word={words[i]} lessonId={lesson.id} /></Card>
    <div className="flex justify-between gap-3 mt-6">
      <Button variant="secondary" disabled={i === 0} onClick={() => setI(i - 1)}>← Trước</Button>
      {i < words.length - 1 ? <Button onClick={() => setI(i + 1)}>Tiếp →</Button> : <Button onClick={() => setPhase('practice')}>Luyện gõ pinyin →</Button>}
    </div>
  </div>
}

function ListeningPractice({ words, onFinish, saving }: { words: Word[]; onFinish: (correct: Set<string>) => void; saving: boolean }) {
  const [deck] = useState(() => shuffle(words))
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<string | null>(null)
  const [correct] = useState(() => new Set<string>())
  const word = deck[i]
  const options = useMemo(() => shuffle([...new Set([word.meaning, ...words.filter((w) => w.id !== word.id).map((w) => w.meaning), 'Tôi chưa nhận ra nghĩa của từ này'])].slice(0, 4)), [word, words])
  return <Card className="p-5 sm:p-8">
    <h2 className="font-bold">Nghe hiểu · từ {i + 1}/{deck.length}</h2>
    <p className="mt-2 text-sm text-muted">Bấm nghe rồi chọn nghĩa. Kết quả nghe được lưu riêng với kết quả gõ.</p>
    <div className="flex gap-3 my-5"><SpeakButton text={word.hanzi} size="lg" /><SpeakButton text={word.hanzi} slow /></div>
    {pick === null ? <div className="grid gap-2">{options.map((meaning) => <Button key={meaning} variant="secondary" onClick={() => { setPick(meaning); if (meaning === word.meaning) correct.add(word.id) }}>{meaning}</Button>)}</div> : <>
      <p role="status" className="mb-4 font-semibold">{pick === word.meaning ? 'Đúng rồi' : 'Chưa đúng. Nghe lại và xem nghĩa bên dưới nhé.'}</p>
      <WordCard word={word} compact />
      <Button className="mt-5" disabled={saving} onClick={() => { if (i === deck.length - 1) onFinish(correct); else { setI(i + 1); setPick(null) } }}>{saving ? 'Đang lưu…' : i === deck.length - 1 ? 'Lưu buổi học' : 'Từ tiếp theo →'}</Button>
    </>}
  </Card>
}

function Practice({ words, onFinish }: { words: Word[]; onFinish: (firstTry: Set<string>) => void }) {
  const initial = useMemo(() => shuffle(words), [words])
  const [queue, setQueue] = useState<Word[]>(initial)
  const [answered, setAnswered] = useState<boolean | null>(null)
  const [firstTry] = useState(() => new Set<string>())
  const [attempted] = useState(() => new Set<string>())
  const [round, setRound] = useState(0)
  const w = queue[0]

  const next = () => {
    const [cur, ...rest] = queue
    const nq = answered ? rest : [...rest, cur]
    setAnswered(null)
    setRound((r) => r + 1)
    if (!nq.length) onFinish(firstTry)
    else setQueue(nq)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && answered !== null && !(e.target instanceof HTMLInputElement)) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div>
      <div className="text-sm text-muted mb-3">
        Còn {queue.length} từ · gõ sai sẽ phải làm lại cho đến khi đúng
      </div>
      <Card className="p-6 sm:p-8" key={round}>
        <div className="text-center mb-6">
          <div className="text-2xl font-semibold">{w.meaning}</div>
          <div className="text-muted">{w.pos}</div>
        </div>
        <PinyinInput
          expected={[w.pinyin, ...(w.alts ?? [])]}
          onResult={(v) => {
            const ok = v === 'correct'
            if (ok && !attempted.has(w.id)) firstTry.add(w.id)
            attempted.add(w.id)
            setAnswered(ok)
          }}
        />
        {answered !== null && (
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <SpeakButton text={w.hanzi} />
              <span className="font-han text-4xl">{w.hanzi}</span>
              <span className="text-gold font-bold tracking-wider">{w.hanViet}</span>
            </div>
            <Button onClick={next}>
              Tiếp <Kbd>Enter</Kbd>
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
