import { useEffect, useRef, useState } from 'react'
import { Mic, Play, Repeat2, Square } from 'lucide-react'
import { speak, type Gender } from '@/lib/speech'
import { useSettings } from '@/store/settings'

const MAX_MS = 10_000

type MicState = 'idle' | 'recording' | 'denied' | 'unsupported'

/**
 * Shadowing: hear the model, record yourself, then play model and recording back to back
 * so the difference in tones is obvious. Recordings stay in memory only.
 * The record button is a red circle that pulses while recording (CSS only; a static halo under reduced motion).
 */
export function ShadowRecorder({ text, gender }: { text: string; gender?: Gender }) {
  const rate = useSettings((s) => s.speechRate)
  const [state, setState] = useState<MicState>(() =>
    typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia ? 'unsupported' : 'idle',
  )
  const [url, setUrl] = useState<string | null>(null)
  const rec = useRef<MediaRecorder | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url)
  }, [url])
  useEffect(() => () => rec.current?.stream.getTracks().forEach((t) => t.stop()), [])

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const r = new MediaRecorder(stream)
      const chunks: Blob[] = []
      r.ondataavailable = (e) => chunks.push(e.data)
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        setUrl(URL.createObjectURL(new Blob(chunks, { type: r.mimeType })))
        setState('idle')
      }
      rec.current = r
      r.start()
      setState('recording')
      timer.current = setTimeout(() => r.state === 'recording' && r.stop(), MAX_MS)
    } catch {
      setState('denied')
    }
  }

  const stop = () => {
    clearTimeout(timer.current)
    rec.current?.stop()
  }

  const playMine = () =>
    new Promise<void>((resolve) => {
      if (!url) return resolve()
      const a = new Audio(url)
      a.onended = () => resolve()
      a.onerror = () => resolve()
      a.play().catch(() => resolve())
    })

  const compare = async () => {
    await speak(text, rate, gender)
    await new Promise((r) => setTimeout(r, 300))
    await playMine()
  }

  if (state === 'unsupported') return <span className="text-footnote text-secondary-label">Trình duyệt không hỗ trợ ghi âm.</span>
  if (state === 'denied') return <span role="alert" className="text-footnote text-danger-text">Chưa được cấp quyền micro. Hãy cho phép micro rồi thử lại.</span>

  const recording = state === 'recording'
  const pill = 'inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full bg-fill px-4 text-footnote font-semibold text-label transition-[transform,opacity] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100'
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="relative grid size-12 place-items-center">
        {recording && <span aria-hidden="true" className="shadow-recorder-ring absolute inset-0 rounded-full bg-danger" />}
        <button
          type="button"
          onClick={recording ? stop : start}
          aria-label={recording ? 'Dừng ghi âm' : url ? 'Ghi âm lại' : 'Ghi âm'}
          aria-pressed={recording}
          className="relative grid size-12 cursor-pointer place-items-center rounded-full bg-danger text-white shadow-sm transition-transform active:scale-90 dark:text-black"
        >
          {recording ? <Square size={16} fill="currentColor" aria-hidden="true" /> : <Mic size={20} aria-hidden="true" />}
        </button>
      </span>
      <span className="min-w-0 text-footnote text-secondary-label" aria-live="polite">{recording ? 'Đang ghi…' : url ? 'Ghi lại' : 'Ghi âm'}</span>
      <button type="button" onClick={playMine} disabled={!url || recording} className={pill}><Play size={14} fill="currentColor" aria-hidden="true" />Giọng tôi</button>
      <button type="button" onClick={compare} disabled={!url || recording} className={pill}><Repeat2 size={16} aria-hidden="true" />So sánh</button>
      <style>{`@keyframes shadow-recorder-pulse{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.7);opacity:0}}.shadow-recorder-ring{animation:shadow-recorder-pulse 1.2s ease-out infinite}@media (prefers-reduced-motion:reduce){.shadow-recorder-ring{animation:none!important;opacity:.3;transform:scale(1.3)}}`}</style>
    </div>
  )
}
