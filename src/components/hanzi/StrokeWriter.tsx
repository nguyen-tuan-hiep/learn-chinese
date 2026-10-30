import HanziWriter from 'hanzi-writer'
import { useEffect, useRef, useState } from 'react'

export type WriterMode = 'animate' | 'trace' | 'recall'

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#1c1917'
}

/** 田字格 practice grid behind a hanzi-writer canvas. */
export function StrokeWriter({
  char,
  mode,
  size = 260,
  onComplete,
  onUnavailable,
}: {
  char: string
  mode: WriterMode
  size?: number
  onComplete?: (mistakes: number) => void
  onUnavailable?: () => void
}) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const writer = useRef<HanziWriter | null>(null)
  const [error, setError] = useState(false)
  const [available, setAvailable] = useState(size)
  const [retry, setRetry] = useState(0)
  const done = useRef(onComplete)
  done.current = onComplete
  const unavailable = useRef(onUnavailable)
  unavailable.current = onUnavailable

  useEffect(() => {
    if (!canvas.current) return
    const observer = new ResizeObserver(([entry]) => setAvailable(Math.min(size, Math.floor(entry.contentRect.width))))
    observer.observe(canvas.current)
    return () => observer.disconnect()
  }, [size])

  useEffect(() => {
    if (!host.current) return
    host.current.innerHTML = ''
    setError(false)
    const w = HanziWriter.create(host.current, char, {
      width: available,
      height: available,
      padding: 18,
      strokeColor: cssVar('--color-ink'),
      radicalColor: cssVar('--color-cinnabar'),
      outlineColor: cssVar('--color-line'),
      drawingColor: cssVar('--color-tone4'),
      highlightColor: cssVar('--color-jade'),
      showOutline: mode !== 'recall',
      showCharacter: mode === 'animate',
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 250,
      drawingWidth: 22,
      onLoadCharDataError: () => { setError(true); unavailable.current?.() },
    })
    writer.current = w
    if (mode === 'animate') {
      w.animateCharacter()
    } else {
      w.quiz({
        showHintAfterMisses: mode === 'trace' ? 1 : 3,
        onComplete: ({ totalMistakes }) => done.current?.(totalMistakes),
      })
    }
    return () => {
      w.cancelQuiz()
    }
  }, [char, mode, available, retry])

  return (
    <div className="flex flex-col items-center gap-2 w-full" style={{ maxWidth: size }}>
      <div ref={canvas} className="relative rounded-xl border border-line bg-surface touch-none w-full overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        <svg className="absolute inset-0 pointer-events-none" viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" aria-hidden>
          <g stroke="var(--color-line)" strokeWidth="1" strokeDasharray="5 5">
            <line x1={size / 2} y1={0} x2={size / 2} y2={size} />
            <line x1={0} y1={size / 2} x2={size} y2={size / 2} />
            <line x1={0} y1={0} x2={size} y2={size} />
            <line x1={size} y1={0} x2={0} y2={size} />
          </g>
        </svg>
        <div ref={host} className="relative" />
        {error && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-muted p-4 text-center"><p>Không tải được dữ liệu nét chữ. Hãy kiểm tra kết nối mạng.</p><button onClick={() => setRetry((n) => n + 1)} className="min-h-11 rounded-lg border border-line bg-surface px-4 text-ink cursor-pointer">Thử tải lại</button></div>}
      </div>
      {mode === 'animate' && (
        <button className="text-sm text-muted hover:text-ink cursor-pointer" onClick={() => writer.current?.animateCharacter()}>
          ↻ Xem lại
        </button>
      )}
    </div>
  )
}
