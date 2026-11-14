import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { VolumeX } from 'lucide-react'
import { hasChineseVoice } from '@/lib/speech'

/** Slim glass notice shown above pages when the device has no Chinese voice. */
export function AudioStatus() {
  const [missing, setMissing] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    const update = () => setMissing(!hasChineseVoice())
    const timer = setTimeout(update, 800)
    window.speechSynthesis?.addEventListener('voiceschanged', update)
    return () => { clearTimeout(timer); window.speechSynthesis?.removeEventListener('voiceschanged', update) }
  }, [])
  if (!missing || pathname === '/settings') return null
  return <p role="status" className="glass-thin mt-4 flex items-start gap-3 rounded-2xl px-4 py-3 text-footnote leading-relaxed">
    <VolumeX aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning-text" />
    <span className="min-w-0">Chưa tìm thấy giọng đọc tiếng Trung trên máy này. <Link to="/settings" className="font-semibold text-tint-text underline">Mở cài đặt giọng đọc</Link> để kiểm tra trước khi làm bài nghe.</span>
  </p>
}
