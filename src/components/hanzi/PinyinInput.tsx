import { forwardRef, useId, useImperativeHandle, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { spring } from '@/components/ui/motion'
import { checkPinyin, numbersToMarks, type PinyinVerdict } from '@/lib/pinyin'
import { Pinyin } from './Pinyin'

export interface PinyinInputHandle {
  focus: () => void
}

const VERDICT: Record<PinyinVerdict, { text: string; cls: string }> = {
  correct: { text: 'Correct', cls: 'text-success-text' },
  tone: { text: 'Right sounds, wrong or missing tone', cls: 'text-warning-text' },
  wrong: { text: 'Not quite', cls: 'text-danger-text' },
}

/**
 * Type pinyin with tone numbers (ni3 hao3) or marks (nǐ hǎo). Enter checks the answer once;
 * afterwards the parent decides what Enter does.
 */
export const PinyinInput = forwardRef<
  PinyinInputHandle,
  { expected: string | string[]; onResult: (v: PinyinVerdict, typed: string) => void; placeholder?: string; autoFocus?: boolean; size?: 'md' | 'lg' }
>(function PinyinInput({ expected, onResult, placeholder = 'Type pinyin, e.g. ni3 hao3', autoFocus = false, size = 'lg' }, ref) {
  const [value, setValue] = useState('')
  const [verdict, setVerdict] = useState<PinyinVerdict | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const inputId = useId()
  useImperativeHandle(ref, () => ({ focus: () => input.current?.focus() }))

  const preview = /\d/.test(value) ? numbersToMarks(value) : ''
  const answer = Array.isArray(expected) ? expected[0] : expected

  const submit = (skip = false) => {
    if (verdict || (!skip && !value.trim())) return
    const v = skip ? 'wrong' : checkPinyin(value, expected)
    setVerdict(v)
    // Hand the keyboard back to the page so 1–4 / Enter reach the rating buttons.
    input.current?.blur()
    onResult(v, value)
  }

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-2 block text-subhead font-medium text-secondary-label">Your answer in pinyin</label>
      <motion.div animate={verdict && verdict !== 'correct' ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
        <input
          id={inputId}
          aria-describedby={`${inputId}-feedback`}
          aria-invalid={verdict && verdict !== 'correct' ? true : undefined}
          enterKeyHint="done"
          ref={input}
          autoFocus={autoFocus}
          value={value}
          readOnly={!!verdict}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !verdict) {
              e.preventDefault()
              e.stopPropagation()
              submit()
            }
          }}
          placeholder={placeholder}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className={`w-full rounded-2xl bg-fill px-4 text-label outline-none transition-shadow placeholder:text-tertiary-label ${
            size === 'lg' ? 'h-14 text-xl' : 'h-12 text-body'
          } ${verdict === 'correct' ? 'ring-2 ring-success' : verdict ? 'ring-2 ring-danger' : 'focus:ring-2 focus:ring-tint'}`}
        />
      </motion.div>
      {!verdict && <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button onClick={() => submit()} disabled={!value.trim()}>Check</Button>
        <Button variant="ghost" onClick={() => submit(true)}>I forgot, show the answer</Button>
      </div>}
      <div id={`${inputId}-feedback`} aria-live="polite" aria-atomic="true" className="mt-2 min-h-6 text-subhead">
        {verdict ? (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring.bouncy} className={`inline-flex items-center gap-1.5 font-semibold ${VERDICT[verdict].cls}`}>
              {verdict === 'correct' ? <Check aria-hidden="true" className="size-4" strokeWidth={3} /> : <X aria-hidden="true" className="size-4" strokeWidth={3} />}
              {VERDICT[verdict].text}
            </motion.span>
            {verdict !== 'correct' && (
              <span>
                Answer: <Pinyin text={answer} className="text-base" />
              </span>
            )}
          </div>
        ) : preview ? (
          <span className="text-secondary-label">
            → <Pinyin text={preview} className="text-base" />
          </span>
        ) : (
          <span className="text-secondary-label">
            Enter to check · digits 1–4 after a syllable for the tone, v = ü ·{' '}
            <a href={`${import.meta.env.BASE_URL}pronunciation?tab=typing`} target="_blank" rel="noreferrer" className="underline hover:text-label">
              How to type
            </a>
          </span>
        )}
      </div>
    </div>
  )
})
