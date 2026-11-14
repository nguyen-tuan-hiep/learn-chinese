import { useMemo } from 'react'
import { Glass } from '@/components/ui/Glass'
import { dateKey } from '@/lib/progress'

const WEEKS = 20
const WEEKDAYS = ['T2', '', 'T4', '', 'T6', '', 'CN']
const OPACITY = [0, 0.3, 0.5, 0.75, 1]
const level = (m: number) => (m === 0 ? 0 : m < 15 ? 1 : m < 30 ? 2 : m < 60 ? 3 : 4)

function Cell({ l, className = '' }: { l: number; className?: string }) {
  return <span className={`block rounded-[4px] ${l === 0 ? 'bg-fill' : 'bg-tint'} ${className}`} style={l ? { opacity: OPACITY[l] } : undefined} />
}

/** "Chuỗi học 20 tuần": Monday-first calendar columns coloured by minutes studied that day. */
export function Heatmap({ days }: { days: { date: string; seconds: number }[] }) {
  const { cells, active } = useMemo(() => {
    const map = new Map(days.map((d) => [d.date, d.seconds]))
    const end = new Date()
    const start = new Date(end)
    start.setDate(end.getDate() - (WEEKS - 1) * 7 - ((end.getDay() + 6) % 7))
    const cells: { date: string; mins: number; future: boolean }[] = []
    for (let d = new Date(start); cells.length < WEEKS * 7; d.setDate(d.getDate() + 1)) {
      const k = dateKey(d)
      cells.push({ date: k, mins: Math.round((map.get(k) ?? 0) / 60), future: d > end })
    }
    return { cells, active: cells.filter((c) => c.mins > 0).length }
  }, [days])
  return <Glass as="section" aria-label="Chuỗi học 20 tuần" className="p-5 sm:p-6">
    <h2 className="text-headline">Chuỗi học 20 tuần</h2>
    <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto pb-1">
      <div aria-hidden="true" className="grid shrink-0 grid-rows-7 gap-1 text-caption leading-4 text-secondary-label">{WEEKDAYS.map((d, i) => <span key={i} className="h-4">{d}</span>)}</div>
      <div className="grid w-fit shrink-0 grid-flow-col grid-rows-7 gap-1" role="img" aria-label={`${active} ngày có học trong ${WEEKS} tuần gần nhất`}>
        {cells.map((c) => c.future ? <span key={c.date} className="size-4" /> : <span key={c.date} title={`${c.date}: ${c.mins} phút`}><Cell l={level(c.mins)} className="size-4" /></span>)}
      </div>
    </div>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-footnote text-secondary-label">
      <span><b className="font-semibold tabular-nums text-label">{active}</b> ngày có học</span>
      <span className="flex items-center gap-1.5">Ít {[0, 1, 2, 3, 4].map((l) => <Cell key={l} l={l} className="size-3" />)} Nhiều</span>
    </div>
  </Glass>
}
