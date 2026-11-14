import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Segmented } from '@/components/ui/Segmented'
import { strokesOf } from './ColoredHanzi'
import { Pinyin } from './Pinyin'
import { SpeakButton } from './SpeakButton'
import { StrokeWriter, type WriterMode } from './StrokeWriter'

const HAN = /\p{Script=Han}/u

/** One small frame of the stroke sequence: strokes written so far in the label colour, the current one in the tint, the rest faint. */
function StrokeFrame({ strokes, step }: { strokes: string[]; step: number }) {
  return <li className="relative">
    <svg viewBox="0 0 1024 1024" className="block size-14 rounded-lg border border-separator bg-white/70 dark:bg-white/5 sm:size-16" role="img" aria-label={`Nét ${step + 1}`}>
      <g stroke="var(--color-separator)" strokeWidth="6" strokeDasharray="28 24" aria-hidden="true">
        <line x1="512" y1="0" x2="512" y2="1024" /><line x1="0" y1="512" x2="1024" y2="512" />
      </g>
      <g transform="translate(0, 900) scale(1, -1)">
        {strokes.map((d, i) => <path key={i} d={d} fill={i < step ? 'var(--color-label)' : i === step ? 'var(--color-tint)' : 'var(--color-separator)'} />)}
      </g>
    </svg>
    <span className="absolute top-0.5 left-1 text-[10px] font-semibold text-secondary-label tabular-nums">{step + 1}</span>
  </li>
}

/** Numbered stroke-by-stroke frames for one character. */
function StrokeSequence({ char }: { char: string }) {
  const [strokes, setStrokes] = useState<string[] | null | undefined>(undefined)
  useEffect(() => {
    let live = true
    setStrokes(undefined)
    strokesOf(char).then((s) => { if (live) setStrokes(s) })
    return () => { live = false }
  }, [char])
  if (strokes === null) return <p className="text-sm text-secondary-label">Chưa có dữ liệu thứ tự nét cho chữ này.</p>
  return <section aria-label={`Thứ tự nét chữ ${char}`}>
    <h3 className="text-headline">Thứ tự nét{strokes ? <span className="text-subhead font-normal text-secondary-label"> · {strokes.length} nét</span> : null}</h3>
    {/* Same height before and after the data arrives, so nothing below moves. */}
    <ol className="mt-2 flex min-h-14 flex-wrap gap-2 sm:min-h-16">
      {strokes ? strokes.map((_, i) => <StrokeFrame key={i} strokes={strokes} step={i} />)
        : Array.from({ length: 6 }, (_, i) => <li key={i} className="skeleton size-14 rounded-lg sm:size-16" />)}
    </ol>
  </section>
}

/**
 * How to write a word: pick a character, watch its strokes drawn in order or trace them,
 * and read the numbered stroke sequence.
 */
export function StrokeOrderGuide({ hanzi, pinyin, meaning, onClose }: { hanzi: string; pinyin?: string; meaning?: string; onClose?: () => void }) {
  const chars = [...hanzi].filter((c) => HAN.test(c))
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<WriterMode>('animate')
  const [result, setResult] = useState<number | null>(null)
  const char = chars[Math.min(index, chars.length - 1)]
  if (!char) return <p className="text-sm text-secondary-label">Từ này không có chữ Hán để luyện viết.</p>
  return <div className="space-y-5">
    <header className="flex items-start gap-3">
      <div className="min-w-0">
        <p className="text-footnote font-medium text-secondary-label">Cách viết</p>
        <p lang="zh-CN" className="font-han mt-1 text-4xl leading-tight">{hanzi}</p>
        {pinyin && <Pinyin text={pinyin} className="text-base" />}
        {meaning && <p className="mt-0.5 text-sm text-secondary-label">{meaning}</p>}
      </div>
      <span className="ml-auto flex shrink-0 items-center gap-1">
        <SpeakButton text={hanzi} size="sm" />
        {onClose && <button type="button" onClick={onClose} aria-label="Đóng" className="grid size-11 cursor-pointer place-items-center rounded-full bg-fill text-secondary-label transition-colors hover:text-label"><X aria-hidden="true" className="size-5" /></button>}
      </span>
    </header>

    {chars.length > 1 && <Segmented label="Chọn chữ để xem cách viết" value={String(index)}
      onChange={(v) => { setIndex(Number(v)); setResult(null) }}
      options={chars.map((c, i) => ({ value: String(i), label: <span lang="zh-CN" className="font-han text-lg">{c}</span> }))} />}

    <div className="flex flex-col items-center gap-3">
      <Segmented<WriterMode> label="Chế độ" value={mode} onChange={(m) => { setMode(m); setResult(null) }}
        options={[{ value: 'animate', label: 'Xem nét' }, { value: 'trace', label: 'Viết theo mẫu' }]} />
      <StrokeWriter key={`${char}-${mode}`} char={char} mode={mode} size={260} onComplete={setResult} />
      <p role="status" className="min-h-5 text-center text-sm text-secondary-label">
        {mode === 'trace' && (result === null ? 'Viết lần lượt từng nét theo nét mờ. Viết sai thứ tự sẽ được nhắc.' : result === 0 ? 'Viết đúng hết các nét.' : `Xong, có ${result} nét cần luyện thêm.`)}
      </p>
    </div>

    <StrokeSequence char={char} />
  </div>
}
