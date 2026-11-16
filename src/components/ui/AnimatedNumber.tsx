import { useEffect, useRef } from 'react'
import { animate, useMotionValue, useReducedMotion } from 'framer-motion'
import { spring } from './motion'

/**
 * A number that springs from its previous value to the new one. Tabular digits keep the width steady.
 * `countUp` also counts up from 0 when it first appears, for headline stats.
 */
export function AnimatedNumber({ value, format = (n: number) => String(Math.round(n)), countUp = false, className = '' }: { value: number; format?: (n: number) => string; countUp?: boolean; className?: string }) {
  const reduce = useReducedMotion()
  const node = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(countUp && !reduce ? 0 : value)
  const fmt = useRef(format)
  fmt.current = format
  useEffect(() => {
    const write = (n: number) => { if (node.current) node.current.textContent = fmt.current(n) }
    if (reduce) { motionValue.jump(value); write(value); return }
    const stop = motionValue.on('change', write)
    const controls = animate(motionValue, value, spring.smooth)
    return () => { stop(); controls.stop() }
  }, [value, reduce, motionValue])
  return <span ref={node} className={`tabular-nums ${className}`}>{format(motionValue.get())}</span>
}
