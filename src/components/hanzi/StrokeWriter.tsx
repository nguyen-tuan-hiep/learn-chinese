import HanziWriter from 'hanzi-writer'
import { useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export type WriterMode = 'animate' | 'trace' | 'recall'

/** Resolves a CSS colour variable to an rgb()/rgba() string hanzi-writer can parse (it does not understand the space syntax). */
function cssColor(name: string, fallback: string) {
  const probe = document.createElement('span')
  probe.style.color = `var(${name})`
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const value = getComputedStyle(probe).color
  probe.remove()
  return value || fallback
}

/** 田字格 practice grid behind a hanzi-writer canvas: a glass panel with dashed guides; colours follow the theme tokens. */
export function StrokeWriter({
  char,
  mode,
  size = 260,
  onComplete,
  onUnavailable,
  onRestart,
}: {
  char: string
  mode: WriterMode
  size?: number
  onComplete?: (mistakes: number) => void
  onUnavailable?: () => void
  onRestart?: () => void
}) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const writer = useRef<HanziWriter | null>(null)
  const [error, setError] = useState(false)
  const [available, setAvailable] = useState(size)
  const [retry, setRetry] = useState(0)
  const [theme, setTheme] = useState(0)
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

  // Redraw with fresh colours when the light/dark theme flips.
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme((n) => n + 1))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!host.current) return
    host.current.innerHTML = ''
    setError(false)
    const w = HanziWriter.create(host.current, char, {
      width: available,
      height: available,
      padding: 18,
      strokeColor: cssColor('--color-label', '#000000'),
      radicalColor: cssColor('--color-feature-radicals', '#007aff'),
      outlineColor: cssColor('--color-separator', '#c6c6c8'),
      drawingColor: cssColor('--color-tint', '#007aff'),
      highlightColor: cssColor('--color-success', '#34c759'),
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
  }, [char, mode, available, retry, theme])

  return (
    <div className="flex w-full flex-col items-center gap-2" style={{ maxWidth: size }}>
      <div ref={canvas} className="glass relative w-full touch-none overflow-hidden rounded-card" style={{ aspectRatio: '1 / 1' }}>
        <svg className="absolute inset-0 pointer-events-none" viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" aria-hidden>
          <g stroke="var(--color-separator)" strokeWidth="1" strokeDasharray="5 5">
            <line x1={size / 2} y1={0} x2={size / 2} y2={size} />
            <line x1={0} y1={size / 2} x2={size} y2={size / 2} />
            <line x1={0} y1={0} x2={size} y2={size} />
            <line x1={size} y1={0} x2={0} y2={size} />
          </g>
        </svg>
        <div ref={host} className="relative" />
        {error && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center text-subhead text-secondary-label"><p>Could not load the stroke data. Check your connection.</p><Button variant="secondary" onClick={() => setRetry((n) => n + 1)}>Try again</Button></div>}
      </div>
      {mode === 'animate' && (
        <Button variant="ghost" size="sm" onClick={() => writer.current?.animateCharacter()}>
          <RotateCcw aria-hidden="true" className="size-4" />Replay
        </Button>
      )}
      {/* With `onRestart`, writing modes get a matching "Restart" button (keeps both modes the same height). */}
      {mode !== 'animate' && onRestart && (
        <Button variant="ghost" size="sm" onClick={() => { onRestart(); setRetry((n) => n + 1) }}>
          <RotateCcw aria-hidden="true" className="size-4" />Restart
        </Button>
      )}
    </div>
  )
}
