import { useRef, useState, type PointerEvent } from 'react'
import { Button } from '@/components/ui/Button'

/** Practice pad when stroke-order data is unavailable for an uncommon form. */
export function FreehandWriter({ glyph, showModel = true, onComplete }: { glyph: string; showModel?: boolean; onComplete: (remembered: boolean) => void }) {
  const [paths, setPaths] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [revealed, setRevealed] = useState(showModel)
  const active = useRef(false)
  const point = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return `${Math.round((e.clientX - rect.left) * 260 / rect.width)} ${Math.round((e.clientY - rect.top) * 260 / rect.height)}`
  }
  const end = (e: PointerEvent<SVGSVGElement>) => {
    if (!active.current) return
    active.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
    setPaths((prev) => [...prev, current])
    setCurrent('')
  }
  return <div className="w-full max-w-[260px]">
    <div className="relative rounded-xl border border-line overflow-hidden bg-surface">
      {revealed && <span className="absolute inset-0 grid place-items-center font-han text-[190px] text-line select-none pointer-events-none">{glyph}</span>}
      <svg viewBox="0 0 260 260" className="relative w-full touch-none" role="img" aria-label={`Bảng luyện viết ${glyph}`}
        onPointerDown={(e) => { active.current = true; e.currentTarget.setPointerCapture(e.pointerId); setCurrent(`M ${point(e)}`) }}
        onPointerMove={(e) => { if (active.current) { const xy = point(e); setCurrent((path) => `${path} L ${xy}`) } }}
        onPointerUp={end} onPointerCancel={end}>
        <path d="M 130 0 V 260 M 0 130 H 260" stroke="var(--color-line)" strokeDasharray="5 5" />
        {[...paths, current].filter(Boolean).map((path, i) => <path key={i} d={path} fill="none" stroke="var(--color-ink)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />)}
      </svg>
    </div>
    <p className="text-xs text-muted mt-2">Dạng này chưa có dữ liệu thứ tự nét. Hãy viết bằng tay rồi đối chiếu mẫu.</p>
    <div className="flex flex-wrap gap-2 mt-3"><Button variant="secondary" onClick={() => { setPaths([]); setCurrent('') }}>Xóa và viết lại</Button>{!revealed && <Button variant="secondary" onClick={() => setRevealed(true)}>Hiện mẫu để kiểm tra</Button>}{revealed && <><Button disabled={!paths.length} onClick={() => onComplete(true)}>Tôi viết được</Button><Button variant="ghost" onClick={() => onComplete(false)}>Cần luyện thêm</Button></>}</div>
  </div>
}
