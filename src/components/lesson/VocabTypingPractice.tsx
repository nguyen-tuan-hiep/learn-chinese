import { useMemo, useState } from 'react'
import type { CourseLesson, Word } from '@/data/types'
import { Button, Card, Kbd } from '@/components/ui/Button'
import { PinyinInput } from '@/components/hanzi/PinyinInput'
import { WordCard } from '@/components/hanzi/WordCard'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { shuffle } from '@/lib/shuffle'
import { useStudyData } from '@/lib/useStudyData'

type Phase = 'typing' | 'listen' | 'done'

/** Pinyin typing and listening are practice activities, so they live in Exercises. */
export function VocabTypingPractice({ lesson }: { lesson: CourseLesson }) {
  const { loaded } = useStudyData()
  const [phase, setPhase] = useState<Phase>('typing')
  if (!loaded) return <p role="status">Đang tải bài luyện từ mới…</p>

  const finish = () => setPhase('done')

  return <Card className="p-5 sm:p-7">
    {phase === 'typing' && <TypingPractice words={lesson.words} onFinish={() => setPhase('listen')} />}
    {phase === 'listen' && <ListeningPractice words={lesson.words} onFinish={finish} />}
    {phase === 'done' && <p role="status" className="mt-4 text-sm text-jade">Đã hoàn thành phần luyện gõ và nghe từ mới.</p>}
  </Card>
}

function TypingPractice({ words, onFinish }: { words: Word[]; onFinish: () => void }) {
  const [queue, setQueue] = useState(() => shuffle(words))
  const [answered, setAnswered] = useState<boolean | null>(null)
  const [round, setRound] = useState(0)
  const word = queue[0]

  const next = () => {
    const [current, ...rest] = queue
    const remaining = answered ? rest : [...rest, current]
    setAnswered(null)
    setRound((value) => value + 1)
    if (!remaining.length) onFinish()
    else setQueue(remaining)
  }

  if (!word) return null
  return <div className="mt-4">
    <p className="mb-3 text-sm text-muted">Còn {queue.length} từ · từ gõ sai sẽ quay lại sau</p>
    <div key={round}>
      <div className="mb-5 text-center">
        <div className="text-2xl font-semibold">{word.meaning}</div>
        <div className="text-sm text-muted">{word.pos}</div>
      </div>
      <PinyinInput
        expected={[word.pinyin, ...(word.alts ?? [])]}
        onResult={(result) => {
          const correct = result === 'correct'
          setAnswered(correct)
        }}
      />
      {answered !== null && <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3"><SpeakButton text={word.hanzi} /><span className="font-han text-4xl">{word.hanzi}</span><span className="text-gold tracking-wider">{word.hanViet}</span></div>
        <Button onClick={next}>Tiếp <Kbd>Enter</Kbd></Button>
      </div>}
    </div>
  </div>
}

function ListeningPractice({ words, onFinish }: { words: Word[]; onFinish: () => void }) {
  const [deck] = useState(() => shuffle(words))
  const [index, setIndex] = useState(0)
  const [pick, setPick] = useState<string | null>(null)
  const word = deck[index]
  const options = useMemo(() => shuffle([...new Set([word.meaning, ...words.filter((item) => item.id !== word.id).map((item) => item.meaning), 'Tôi chưa nhận ra nghĩa của từ này'])].slice(0, 4)), [word, words])
  return <div className="mt-4">
    <h3 className="font-semibold">Nghe hiểu · từ {index + 1}/{deck.length}</h3>
    <p className="mt-1 text-sm text-muted">Bấm nghe rồi chọn nghĩa của từ.</p>
    <div className="my-4 flex gap-3"><SpeakButton text={word.hanzi} size="lg" /><SpeakButton text={word.hanzi} slow /></div>
    {pick === null ? <div className="grid gap-2">{options.map((meaning) => <Button key={meaning} variant="secondary" onClick={() => setPick(meaning)}>{meaning}</Button>)}</div> : <>
      <p role="status" className="mb-4 font-semibold">{pick === word.meaning ? 'Đúng rồi' : 'Chưa đúng. Nghe lại và xem nghĩa bên dưới nhé.'}</p>
      <WordCard word={word} compact />
      <Button className="mt-5" onClick={() => { if (index === deck.length - 1) onFinish(); else { setIndex((current) => current + 1); setPick(null) } }}>{index === deck.length - 1 ? 'Hoàn thành luyện từ' : 'Từ tiếp theo →'}</Button>
    </>}
  </div>
}
