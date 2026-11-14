import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import type { CourseLesson, Word } from '@/data/types'
import { Button, Card, Kbd } from '@/components/ui/Button'
import { PinyinInput } from '@/components/hanzi/PinyinInput'
import { WordCard } from '@/components/hanzi/WordCard'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { shuffle } from '@/lib/shuffle'
import { useStudyData } from '@/lib/useStudyData'
import { PartBar } from './parts/PartTitle'
import { Result } from './parts/Result'

type Phase = 'typing' | 'listen' | 'done'

/** Pinyin typing and listening are practice activities, so they live in Exercises. */
export function VocabTypingPractice({ lesson }: { lesson: CourseLesson }) {
  const { loaded } = useStudyData()
  const [phase, setPhase] = useState<Phase>('typing')
  if (!loaded) return <p role="status" className="text-subhead text-secondary-label">Đang tải bài luyện từ mới…</p>

  const finish = () => setPhase('done')

  return <Card className="p-5 sm:p-7">
    {phase !== 'done' && <p className="text-footnote font-semibold text-secondary-label">Bước {phase === 'typing' ? 1 : 2}/2 · {phase === 'typing' ? 'Gõ pinyin' : 'Nghe hiểu'}</p>}
    {phase === 'typing' && <TypingPractice words={lesson.words} onFinish={() => setPhase('listen')} />}
    {phase === 'listen' && <ListeningPractice words={lesson.words} onFinish={finish} />}
    {phase === 'done' && <p role="status" className="flex items-center gap-2 text-body font-medium text-success-text"><span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-success-soft"><Check className="size-3.5" strokeWidth={3} /></span>Đã hoàn thành phần luyện gõ và nghe từ mới.</p>}
  </Card>
}

function TypingPractice({ words, onFinish }: { words: Word[]; onFinish: () => void }) {
  const [total] = useState(words.length)
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
  return <div className="mt-3">
    <PartBar part="exercises" label="Tiến độ gõ pinyin" value={(total - queue.length) / total} />
    <p className="mt-2 text-footnote text-secondary-label tabular-nums">Còn {queue.length} từ · từ gõ sai sẽ quay lại sau</p>
    <div key={round} className="mt-5">
      <div className="mb-6 text-center">
        <div className="text-title1 text-balance">{word.meaning}</div>
        <div className="mt-1 text-subhead text-secondary-label">{word.pos}</div>
      </div>
      <PinyinInput
        // Focus only once the learner is already typing (next words), never when the tab opens.
        autoFocus={round > 0}
        expected={[word.pinyin, ...(word.alts ?? [])]}
        onResult={(result) => {
          const correct = result === 'correct'
          setAnswered(correct)
        }}
      />
      {answered !== null && <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-separator pt-4">
        <div className="flex items-center gap-3"><SpeakButton text={word.hanzi} /><span lang="zh-CN" className="font-han text-4xl">{word.hanzi}</span><span className="text-subhead font-medium text-warning-text">{word.hanViet}</span></div>
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
  return <div className="mt-3">
    <PartBar part="exercises" label="Tiến độ nghe hiểu" value={index / deck.length} />
    <h4 className="mt-3 text-headline tabular-nums">Nghe hiểu · từ {index + 1}/{deck.length}</h4>
    <p className="mt-1 text-subhead text-secondary-label">Bấm nghe rồi chọn nghĩa của từ.</p>
    <div className="my-5 flex items-center gap-3"><SpeakButton text={word.hanzi} size="lg" /><SpeakButton text={word.hanzi} slow /></div>
    {pick === null ? <div className="grid gap-2">{options.map((meaning) => <Button key={meaning} variant="secondary" className="h-auto justify-start whitespace-normal py-3 text-left" onClick={() => setPick(meaning)}>{meaning}</Button>)}</div> : <>
      <Result ok={pick === word.meaning} className="mb-4">{pick === word.meaning ? 'Đúng rồi' : 'Chưa đúng. Nghe lại và xem nghĩa bên dưới nhé'}</Result>
      <WordCard word={word} compact />
      <Button className="mt-5" onClick={() => { if (index === deck.length - 1) onFinish(); else { setIndex((current) => current + 1); setPick(null) } }}>{index === deck.length - 1 ? 'Hoàn thành luyện từ' : 'Từ tiếp theo →'}</Button>
    </>}
  </div>
}
