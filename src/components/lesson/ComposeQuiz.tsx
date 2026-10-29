import { useState } from 'react'
import type { Radical } from '@/data/radicals'
import { Button } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { composeQuestions, radicalFamily } from '@/lib/radicalFamily'

/** "亻 + 木 = ?": pick the character the parts build, then see the words it appears in. Practice only, not graded. */
export function ComposeQuiz({ radical }: { radical: Radical }) {
  const questions = composeQuestions(radical)
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  if (!questions.length) return null
  if (i >= questions.length) return <div>
    <h3 className="font-bold">Ghép chữ</h3>
    <p className="mt-2 text-jade font-semibold" role="status">Xong phần ghép: đúng {score}/{questions.length} câu.</p>
    <Button variant="ghost" className="mt-2" onClick={() => { setI(0); setPicked(null); setScore(0) }}>Ghép lại</Button>
  </div>
  const q = questions[i]
  const member = radicalFamily(radical).find((m) => m.char === q.answer)!
  return <div>
    <h3 className="font-bold">Ghép chữ · câu {i + 1}/{questions.length}</h3>
    <p className="mt-3 text-center font-han text-5xl" aria-label={`${q.parts[0]} cộng ${q.parts[1]} bằng chữ nào?`}>{q.parts[0]} <span className="text-muted">+</span> {q.parts[1]} <span className="text-muted">=</span> {picked ? q.answer : '?'}</p>
    <div className="grid grid-cols-3 gap-2 mt-4">{q.options.map((c) => <Button key={c} aria-label={`Chọn ${c}`} variant={picked === c ? (c === q.answer ? 'good' : 'danger') : picked && c === q.answer ? 'good' : 'secondary'}
      className="font-han !text-3xl min-h-14" onClick={() => { if (picked) return; setPicked(c); if (c === q.answer) setScore(score + 1) }}>{c}</Button>)}</div>
    {picked && <div className="mt-4 rounded-xl bg-sunken p-4 text-sm" role="status">
      <p className={`font-semibold ${picked === q.answer ? 'text-jade' : 'text-cinnabar'}`}>{picked === q.answer ? 'Đúng rồi!' : `Chưa đúng. ${q.parts.join(' + ')} = ${q.answer}.`}</p>
      <p className="mt-1"><span className="font-han text-lg">{q.answer}</span> <Pinyin text={member.pinyin} /> · {member.gloss}</p>
      {member.words.length > 0 && <p className="mt-1 text-muted">Gặp trong: {member.words.slice(0, 3).map((w) => <span key={w.key} className="mr-2"><span className="font-han text-ink">{w.hanzi}</span> ({w.meaning})</span>)}</p>}
      <Button variant="secondary" className="mt-3" onClick={() => { setI(i + 1); setPicked(null) }}>{i < questions.length - 1 ? 'Câu tiếp' : 'Xem kết quả'}</Button>
    </div>}
  </div>
}
