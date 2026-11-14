import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Press-to-play state for a tile: `playing` while the audio runs, `pulse` counts presses (key for a ripple).
 * `play` may resolve when the audio ends; a failure just ends the playing state.
 */
export function usePlayback(play: (text: string) => Promise<void> | void, text: string) {
  const [playing, setPlaying] = useState(false)
  const [pulse, setPulse] = useState(0)
  const alive = useRef(true)
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])
  const press = useCallback(async () => {
    setPulse((n) => n + 1)
    setPlaying(true)
    try { await play(text) } catch { /* speech unavailable: nothing to show */ }
    finally { if (alive.current) setPlaying(false) }
  }, [play, text])
  return { playing, pulse, press }
}
