import { useEffect, useState } from 'react'

/**
 * True while the user is scrolling down the page (past the first screenful's top), false as soon as they scroll up
 * or `resetKey` changes (a new page). Reaching the bottom keeps it compact. Small moves and the iOS bounce at
 * either end are ignored: the position is clamped to the page's real scroll range.
 */
export function useScrollCompact(resetKey?: unknown, { start = 64, step = 8 } = {}) {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    setCompact(false)
    const pos = () => Math.min(Math.max(0, window.scrollY), document.documentElement.scrollHeight - window.innerHeight)
    let last = pos()
    let frame = 0
    const check = () => {
      frame = 0
      const y = pos()
      if (y < start) setCompact(false)
      else if (y - last > step) setCompact(true)
      else if (last - y > step) setCompact(false)
      else return // too small a move to decide; keep `last` so slow scrolls still add up
      last = y
    }
    const on = () => { if (!frame) frame = requestAnimationFrame(check) }
    window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); if (frame) cancelAnimationFrame(frame) }
  }, [resetKey, start, step])
  return compact
}
