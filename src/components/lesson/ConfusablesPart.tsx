import { Scale } from 'lucide-react'
import type { ConfusablePair } from '@/data/types'
import { Card } from '@/components/ui/Button'
import { Rise, Stagger } from '@/components/ui/motion'
import { partSoft } from '@/lib/palette'
import { PartTitle } from './parts/PartTitle'

/** Phân biệt từ: each pair of easily-mixed words gets a panel with the difference and example sentences. */
export function ConfusablesPart({ pairs }: { pairs: ConfusablePair[] }) {
  return <div className="space-y-5">
    <PartTitle part="confusables" icon={Scale} title="Phân biệt từ" summary={`${pairs.length} cặp từ dễ nhầm`} />
    <p className="text-subhead leading-relaxed text-secondary-label">Các cặp dưới đây là ghi chú đối chiếu do website biên soạn theo bài.</p>
    <Stagger className="space-y-4">
      {pairs.map((pair, index) => <Rise key={`${pair.a}-${pair.b}-${index}`}>
        <Card className="min-w-0 p-5 sm:p-7">
          <p className="text-footnote font-semibold text-secondary-label">Cặp {index + 1}</p>
          <h3 lang="zh-CN" className="mt-1 font-han text-3xl font-semibold break-words">{pair.a} <span className="font-sans text-title3 font-normal text-tertiary-label">/</span> {pair.b}</h3>
          <p className="mt-3 text-body leading-relaxed text-secondary-label">{pair.difference}</p>
          {pair.examples.length > 0 && <ul className="mt-4 space-y-2.5">
            {pair.examples.map((example, i) => <li key={`${example.hanzi}-${i}`} className="rounded-2xl p-4" style={{ background: partSoft('confusables') }}>
              <p lang="zh-CN" className="font-han text-xl leading-snug break-words">{example.hanzi}</p>
              <p className="mt-0.5 text-subhead text-secondary-label">{example.pinyin}</p>
              <p className="mt-1 text-subhead">{example.vi}</p>
            </li>)}
          </ul>}
        </Card>
      </Rise>)}
    </Stagger>
  </div>
}
