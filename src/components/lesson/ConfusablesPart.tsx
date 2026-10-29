import type { ConfusablePair } from '@/data/types'
import { Card } from '@/components/ui/Button'

export function ConfusablesPart({ pairs }: { pairs: ConfusablePair[] }) {
  return <div className="space-y-4">
    <p className="text-sm text-muted">Các cặp dưới đây là ghi chú đối chiếu do website biên soạn theo bài.</p>
    {pairs.map((pair, index) => <Card key={`${pair.a}-${pair.b}-${index}`} className="p-5 sm:p-7">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-xs font-bold text-muted">CẶP {index + 1}</span>
        <h2 className="font-han text-2xl font-semibold">{pair.a} <span className="font-sans text-sm text-muted">/</span> {pair.b}</h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed">{pair.difference}</p>
      {pair.examples.map((example, i) => <div key={`${example.hanzi}-${i}`} className="mt-3 rounded-xl bg-sunken p-3">
        <p className="font-han text-lg">{example.hanzi}</p>
        <p className="text-sm text-muted">{example.pinyin}</p>
        <p className="mt-1 text-sm">{example.vi}</p>
      </div>)}
    </Card>)}
  </div>
}
