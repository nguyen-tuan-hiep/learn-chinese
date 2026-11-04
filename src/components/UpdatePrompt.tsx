import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/Button'
import { EASE } from '@/components/ui/motion'

/** How often an open app checks for a newer version. */
const CHECK_EVERY_MS = 60 * 60 * 1000

/**
 * Registers the service worker and tells the learner about it: once when the app is ready to
 * work offline, and whenever a new version is waiting. The new version loads only when they tap "Tải lại".
 */
export function UpdatePrompt() {
  const { needRefresh: [needRefresh, setNeedRefresh], offlineReady: [offlineReady, setOfflineReady], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return
      setInterval(() => { if (navigator.onLine) void registration.update() }, CHECK_EVERY_MS)
    },
  })

  useEffect(() => {
    if (!offlineReady) return
    const timer = setTimeout(() => setOfflineReady(false), 5000)
    return () => clearTimeout(timer)
  }, [offlineReady, setOfflineReady])

  const open = needRefresh || offlineReady
  return <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4 md:inset-x-auto md:right-6 md:bottom-6">
    <AnimatePresence>
      {open && <motion.div key={needRefresh ? 'update' : 'offline'} role="status"
        initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.3, ease: EASE }}
        className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-surface p-3 pl-4 shadow-lift">
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-xl bg-jade-soft text-jade">{needRefresh ? '↻' : '✓'}</span>
        <p className="min-w-0 flex-1 text-sm">
          <span className="block font-semibold">{needRefresh ? 'Có bản mới' : 'Đã sẵn sàng học offline'}</span>
          <span className="block text-muted">{needRefresh ? 'Tải lại để dùng bản mới nhất.' : 'Lần sau không cần mạng vẫn mở được.'}</span>
        </p>
        {needRefresh ? <>
          <Button variant="ghost" size="sm" onClick={() => setNeedRefresh(false)}>Để sau</Button>
          <Button size="sm" onClick={() => void updateServiceWorker(true)}>Tải lại</Button>
        </> : <Button variant="ghost" size="sm" aria-label="Đóng" onClick={() => setOfflineReady(false)}>✕</Button>}
      </motion.div>}
    </AnimatePresence>
  </div>
}
