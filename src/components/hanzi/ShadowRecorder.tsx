import { useEffect, useRef, useState } from 'react'
import { speak, type Gender } from '@/lib/speech'
import { useSettings } from '@/store/settings'

const MAX_MS = 10_000

type MicState = 'idle' | 'recording' | 'denied' | 'unsupported'

/**
 * Shadowing: hear the model, record yourself, then play model and recording back to back
 * so the difference in tones is obvious. Recordings stay in memory only.
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

  if (state === 'unsupported') return <span className="text-xs text-muted">Trình duyệt không hỗ trợ ghi âm.</span>
  if (state === 'denied') return <span className="text-xs text-cinnabar">Chưa được cấp quyền micro. Hãy cho phép micro rồi thử lại.</span>

  const btn = 'rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-semibold cursor-pointer hover:bg-sunken disabled:opacity-30'
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {state === 'recording' ? (
        <button onClick={stop} className={`${btn} !border-cinnabar text-cinnabar`}>
          <span className="inline-block size-2 rounded-full bg-cinnabar animate-pulse mr-1.5" />
          Dừng
        </button>
      ) : (
        <button onClick={start} className={btn}>
          ● {url ? 'Ghi lại' : 'Ghi âm'}
        </button>
      )}
      <button onClick={playMine} disabled={!url || state === 'recording'} className={btn}>
        ▶ Giọng tôi
      </button>
      <button onClick={compare} disabled={!url || state === 'recording'} className={btn}>
        ⇄ So sánh
      </button>
    </div>
  )
}
