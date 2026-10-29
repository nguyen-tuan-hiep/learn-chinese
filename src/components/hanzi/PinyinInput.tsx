import { forwardRef, useId, useImperativeHandle, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { checkPinyin, numbersToMarks, type PinyinVerdict } from '@/lib/pinyin'
import { Pinyin } from './Pinyin'

export interface PinyinInputHandle {
  focus: () => void
}

const VERDICT: Record<PinyinVerdict, { text: string; cls: string }> = {
  correct: { text: 'Chính xác', cls: 'text-jade' },
  tone: { text: 'Đúng âm, sai hoặc thiếu thanh điệu', cls: 'text-tone2' },
  wrong: { text: 'Chưa đúng', cls: 'text-cinnabar' },
}

/**
 * Type pinyin with tone numbers (ni3 hao3) or marks (nǐ hǎo). Enter checks the answer once;
 * afterwards the parent decides what Enter does.
 */
export const PinyinInput = forwardRef<
  PinyinInputHandle,
  { expected: string | string[]; onResult: (v: PinyinVerdict, typed: string) => void; placeholder?: string; autoFocus?: boolean; size?: 'md' | 'lg' }
>(function PinyinInput({ expected, onResult, placeholder = 'Gõ pinyin, ví dụ: ni3 hao3', autoFocus = true, size = 'lg' }, ref) {
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
      <label htmlFor={inputId} className="block text-sm font-medium mb-2">Câu trả lời bằng pinyin</label>
      <input
        id={inputId}
        aria-describedby={`${inputId}-feedback`}
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
        className={`w-full rounded-xl border bg-surface px-4 outline-none transition focus:border-ink ${
          size === 'lg' ? 'py-3.5 text-xl' : 'py-2.5 text-base'
        } ${verdict === 'correct' ? 'border-jade' : verdict ? 'border-cinnabar' : 'border-line'}`}
      />
      {!verdict && <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={() => submit()} disabled={!value.trim()}>Kiểm tra</Button>
        <Button variant="ghost" onClick={() => submit(true)}>Chưa nhớ, xem đáp án</Button>
      </div>}
      <div id={`${inputId}-feedback`} aria-live="polite" aria-atomic="true" className="mt-2 min-h-6 text-sm">
        {verdict ? (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className={`font-semibold ${VERDICT[verdict].cls}`}>{VERDICT[verdict].text}</span>
            {verdict !== 'correct' && (
              <span>
                Đáp án: <Pinyin text={answer} className="text-base" />
              </span>
            )}
          </div>
        ) : preview ? (
          <span className="text-muted">
            → <Pinyin text={preview} className="text-base" />
          </span>
        ) : (
          <span className="text-muted">
            Enter để kiểm tra · số 1–4 sau âm tiết cho thanh điệu, v = ü ·{' '}
            <a href={`${import.meta.env.BASE_URL}pronunciation?tab=typing`} target="_blank" rel="noreferrer" className="underline hover:text-ink">
              Cách gõ
            </a>
          </span>
        )}
      </div>
    </div>
  )
})
