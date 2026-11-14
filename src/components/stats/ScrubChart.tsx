import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { dateKey } from '@/lib/progress'
import { spring } from '@/components/ui/motion'

export type ChartRange = 7 | 30 | 90

const BARS_H = 112
const fmtDay = (key: string) => `${Number(key.slice(8))}/${Number(key.slice(5, 7))}`

/**
 * Minutes studied per day as slim bars, ending today. Drag (touch or mouse), click or use ←/→ to
 * scrub: the chosen bar turns dark and a black pill with its value follows it.
 * `touch-action: pan-y` keeps vertical page scroll; the browser only cancels the pointer when a
 * vertical pan starts, so a horizontal drag scrubs and a vertical swipe scrolls.
 */
export function ScrubChart({ days, range, goal }: { days: { date: string; seconds: number }[]; range: ChartRange; goal: number }) {
  const reduce = useReducedMotion()
  const series = useMemo(() => {
    const map = new Map(days.map((d) => [d.date, d.seconds]))
    const out: { date: string; mins: number }[] = []
    const cursor = new Date()
    cursor.setDate(cursor.getDate() - (range - 1))
    for (let i = 0; i < range; i++) {
      const k = dateKey(cursor)
      out.push({ date: k, mins: Math.round((map.get(k) ?? 0) / 60) })
      cursor.setDate(cursor.getDate() + 1)
    }
    return out
  }, [days, range])
  const n = series.length
  const empty = series.every((d) => d.mins === 0)
  const scale = Math.max(10, ...series.map((d) => d.mins))
  const [picked, setPicked] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  useEffect(() => setPicked(null), [range])
  const index = Math.min(picked ?? n - 1, n - 1)

  const box = useRef<HTMLDivElement>(null)
  const pill = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [pillW, setPillW] = useState(0)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const current = series[index]
  const label = `${current.mins} phút · ${fmtDay(current.date)}`
  useLayoutEffect(() => { if (pill.current) setPillW(pill.current.offsetWidth) }, [label])
  const center = ((index + 0.5) / n) * width
  const x = Math.min(Math.max(center - pillW / 2, 0), Math.max(0, width - pillW))

  const pick = useCallback((e: PointerEvent) => {
    const rect = box.current?.getBoundingClientRect()
    if (!rect || !rect.width) return
    setPicked(Math.min(n - 1, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * n))))
  }, [n])
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0
    if (step) setPicked(Math.min(n - 1, Math.max(0, index + step)))
    else if (e.key === 'Home') setPicked(0)
    else if (e.key === 'End') setPicked(n - 1)
    else return
    e.preventDefault()
  }

  const ticks = useMemo(() => [0, 1, 2, 3, 4].map((k) => Math.round((k * (n - 1)) / 4)), [n])

  return <div className="select-none">
    <div ref={box} role="slider" tabIndex={0} aria-label="Phút học mỗi ngày" aria-orientation="horizontal"
      aria-valuemin={0} aria-valuemax={n - 1} aria-valuenow={index} aria-valuetext={`${fmtDay(current.date)}: ${current.mins} phút`}
      onKeyDown={onKey}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); pick(e) }}
      onPointerMove={(e) => { if (dragging) pick(e) }}
      onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)}
      style={{ touchAction: 'pan-y' }}
      className="relative h-[140px] cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-tint">
      {!empty && <motion.div ref={pill} initial={false} animate={{ x }} transition={reduce ? { duration: 0 } : spring.snappy}
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full bg-primary-bg px-3 py-1 text-footnote font-semibold tabular-nums text-on-primary">{label}</motion.div>}
      <div className="absolute inset-x-0 bottom-0 flex items-end gap-[2px]" style={{ height: BARS_H }}>
        {goal <= scale && !empty && <div aria-hidden="true" className="absolute inset-x-0 border-t border-dashed border-separator" style={{ bottom: (goal / scale) * BARS_H }} />}
        {series.map((d, i) => {
          const on = i === index && !empty
          const h = d.mins ? Math.max(5, (d.mins / scale) * BARS_H) : 4
          return <div key={`${range}-${d.date}`} className="flex h-full min-w-0 flex-1 items-end justify-center">
            <motion.div aria-hidden="true" initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={reduce ? { duration: 0 } : { ...spring.smooth, delay: Math.min(i * 0.008, 0.4) }}
              style={{ height: h, originY: 1, ...(!on && d.mins ? { background: 'var(--color-tint)' } : null) }}
              className={`w-full max-w-2 rounded-full transition-colors duration-150 ${on ? 'bg-label' : d.mins ? '' : 'bg-fill'}`} />
          </div>
        })}
        {empty && <p className="absolute inset-x-0 top-1/3 text-center text-footnote text-secondary-label">Chưa có dữ liệu học</p>}
      </div>
    </div>
    <div aria-hidden="true" className="relative mt-2 h-4 text-caption tabular-nums text-secondary-label">
      {ticks.map((t, k) => <span key={k} className="absolute top-0 whitespace-nowrap"
        style={{ left: `${((t + 0.5) / n) * 100}%`, transform: k === 0 ? 'translateX(-25%)' : k === 4 ? 'translateX(-75%)' : 'translateX(-50%)' }}>{fmtDay(series[t].date)}</span>)}
    </div>
  </div>
}
