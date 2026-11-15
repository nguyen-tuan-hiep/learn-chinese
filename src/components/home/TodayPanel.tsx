import type { ReactNode } from 'react'
import { Flame, Languages, Timer } from 'lucide-react'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Panel } from '@/components/ui/Panel'
import { ProgressRing } from '@/components/ui/Progress'

function Stat({ value, unit, caption, icon }: { value: number; unit?: string; caption: string; icon: ReactNode }) {
  return <div className="min-w-0">
    <p className="text-title1 font-light leading-none tabular-nums"><AnimatedNumber value={value} />{unit && <span className="text-subhead text-secondary-label"> {unit}</span>}</p>
    <p className="mt-1.5 flex items-center gap-1 text-footnote text-secondary-label"><span aria-hidden="true" className="inline-flex [&>svg]:size-3.5">{icon}</span><span className="min-w-0 truncate">{caption}</span></p>
  </div>
}

/** Today's minutes against the goal, plus streak and words learned. */
export function TodayPanel({ minutes, goal, streak, words }: { minutes: number; goal: number; streak: number; words: number }) {
  return <Panel icon={<Timer />} title="Today">
    <div className="flex items-center gap-5">
      <ProgressRing value={minutes / goal} size={88} stroke={8} color="var(--color-tint)" label={`${minutes} / ${goal}′`} className="[&>span:last-child]:text-footnote" />
      <div className="grid min-w-0 flex-1 grid-cols-3 gap-3">
        <Stat value={minutes} unit="min" caption="studied" icon={<Timer strokeWidth={2.25} />} />
        <Stat value={streak} unit="days" caption="streak" icon={<Flame strokeWidth={2.25} />} />
        <Stat value={words} caption="words learned" icon={<Languages strokeWidth={2.25} />} />
      </div>
    </div>
  </Panel>
}
