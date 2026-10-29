import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { hasChineseVoice } from '@/lib/speech'

export function AudioStatus() {
  const [missing, setMissing] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    const update = () => setMissing(!hasChineseVoice())
    const timer = setTimeout(update, 800)
    window.speechSynthesis?.addEventListener('voiceschanged', update)
    return () => { clearTimeout(timer); window.speechSynthesis?.removeEventListener('voiceschanged', update) }
  }, [])
  if (!missing || pathname === '/stats') return null
  return <p role="status" className="mt-4 rounded-xl bg-gold-soft p-3 text-sm leading-relaxed">Chưa tìm thấy giọng đọc tiếng Trung trên máy này. <Link to="/stats#settings" className="underline font-semibold">Mở cài đặt giọng đọc</Link> để kiểm tra trước khi làm bài nghe.</p>
}
