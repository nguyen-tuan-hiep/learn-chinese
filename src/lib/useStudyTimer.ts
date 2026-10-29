import { useEffect } from 'react'
import { db } from './db'
import { dateKey } from './progress'

const TICK = 10_000
const IDLE_AFTER = 90_000

export async function addStudySeconds(seconds: number) {
  const date = dateKey()
  await db.transaction('rw', db.days, async () => {
    const day = await db.days.get(date)
    await db.days.put({ date, seconds: (day?.seconds ?? 0) + seconds })
  })
}

/** Counts real study time: only while the page is visible and you interacted in the last 90s. */
export function useStudyTimer() {
  useEffect(() => {
    let last = Date.now()
    const touch = () => (last = Date.now())
    const events = ['pointerdown', 'keydown', 'scroll'] as const
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }))
    const t = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - last < IDLE_AFTER) addStudySeconds(TICK / 1000)
    }, TICK)
    return () => {
      clearInterval(t)
      events.forEach((e) => window.removeEventListener(e, touch))
    }
  }, [])
}
