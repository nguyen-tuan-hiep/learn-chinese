import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/Button'
import { EASE } from '@/components/ui/motion'

/** How often an open app checks for a newer version. */
const CHECK_EVERY_MS = 60 * 60 * 1000

/** Screens with study in progress; a new version waits until the learner leaves them, so a reload never cuts a lesson short. */
const BUSY = /^\/(review|pronunciation|start)$|^\/(lesson|radicals)\//

/**
 * Registers the service worker and keeps the app up to date on its own: it checks for a new version every hour and
 * whenever the app comes back to the foreground, and loads it right away, or as soon as the learner leaves a study screen.
 * Tells the learner once when the app is ready to work offline.
 */
export function UpdatePrompt() {
  const { pathname } = useLocation()
  const { needRefresh: [needRefresh], offlineReady: [offlineReady, setOfflineReady], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return
      const check = () => { if (navigator.onLine) void registration.update() }
      setInterval(check, CHECK_EVERY_MS)
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check() })
    },
  })

  useEffect(() => {
    if (needRefresh && !BUSY.test(pathname)) void updateServiceWorker(true)
  }, [needRefresh, pathname, updateServiceWorker])

  useEffect(() => {
    if (!offlineReady) return
    const timer = setTimeout(() => setOfflineReady(false), 5000)
    return () => clearTimeout(timer)
  }, [offlineReady, setOfflineReady])

  const open = offlineReady && !needRefresh
  return <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4 md:inset-x-auto md:right-6 md:bottom-6">
    <AnimatePresence>
      {open && <motion.div key="offline" role="status"
        initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.3, ease: EASE }}
        className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-surface p-3 pl-4 shadow-lift">
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-xl bg-jade-soft text-jade">✓</span>
        <p className="min-w-0 flex-1 text-sm">
          <span className="block font-semibold">Ready to study offline</span>
          <span className="block text-muted">Next time it opens without a connection.</span>
        </p>
        <Button variant="ghost" size="sm" aria-label="Close" onClick={() => setOfflineReady(false)}>✕</Button>
      </motion.div>}
    </AnimatePresence>
  </div>
}
