import { cheerAnswer } from '@/store/mascot'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, RotateCcw, X } from 'lucide-react'
import type { Radical } from '@/data/radicals'
import { Button } from '@/components/ui/Button'
import { spring } from '@/components/ui/motion'
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
    <h3 className="text-headline">Build characters</h3>
    <p className="mt-2 flex items-center gap-2 font-semibold text-success-text" role="status"><Check aria-hidden="true" className="size-5" />Done: {score}/{questions.length} correct.</p>
    <Button variant="secondary" className="mt-3" onClick={() => { setI(0); setPicked(null); setScore(0) }}><RotateCcw aria-hidden="true" className="size-4" />Try again</Button>
  </div>
  const q = questions[i]
  const member = radicalFamily(radical).find((m) => m.char === q.answer)!
  const right = picked === q.answer
  return <div>
    <h3 className="text-headline">Build characters <span className="font-normal text-secondary-label tabular-nums">· question {i + 1}/{questions.length}</span></h3>
    <p className="mt-4 rounded-card bg-fill py-5 text-center font-han text-5xl" aria-label={`${q.parts[0]} plus ${q.parts[1]} makes which character?`}>{q.parts[0]} <span className="text-secondary-label">+</span> {q.parts[1]} <span className="text-secondary-label">=</span> <span className={picked ? (right ? 'text-success-text' : 'text-danger-text') : ''}>{picked ? q.answer : '?'}</span></p>
    <div className="mt-4 grid grid-cols-3 gap-2.5">{q.options.map((c) => <Button key={c} aria-label={`Pick ${c}`} size="lg" variant={picked === c ? (c === q.answer ? 'good' : 'danger') : picked && c === q.answer ? 'good' : 'secondary'}
      className="min-h-14 font-han !text-3xl" onClick={() => { if (picked) return; setPicked(c); cheerAnswer(c === q.answer); if (c === q.answer) setScore(score + 1) }}>{c}</Button>)}</div>
    <AnimatePresence initial={false}>
      {picked && <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring.smooth} className="mt-4 rounded-card bg-fill p-4 text-subhead" role="status">
        <p className={`flex items-center gap-1.5 font-semibold ${right ? 'text-success-text' : 'text-danger-text'}`}>{right ? <Check aria-hidden="true" className="size-4" /> : <X aria-hidden="true" className="size-4" />}{right ? 'Correct.' : `Not quite. ${q.parts.join(' + ')} = ${q.answer}.`}</p>
        <p className="mt-1"><span className="font-han text-lg">{q.answer}</span> <Pinyin text={member.pinyin} /> · {member.gloss}</p>
        {member.words.length > 0 && <p className="mt-1 text-secondary-label">Found in: {member.words.slice(0, 3).map((w) => <span key={w.key} className="mr-2"><span className="font-han text-label">{w.hanzi}</span> ({w.meaning})</span>)}</p>}
        <Button variant="primary" className="mt-3" onClick={() => { setI(i + 1); setPicked(null) }}>{i < questions.length - 1 ? 'Next question' : 'See results'}</Button>
      </motion.div>}
    </AnimatePresence>
  </div>
}
