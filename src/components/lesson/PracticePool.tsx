import { useMemo, useState } from 'react'
import { practicePool, type PracticeWord } from '@/lib/practicePool'
import { useStudyData } from '@/lib/useStudyData'

export function PracticePool({ children }: { children: (pool: PracticeWord[]) => React.ReactNode }) {
  const { loaded, cards } = useStudyData()
  const [expanded, setExpanded] = useState(false)
  const pool = useMemo(() => practicePool(cards, expanded), [cards, expanded])
  if (!loaded) return <p role="status" className="mt-6">Đang tải từ đã học…</p>
  const hasLearned = cards.some((c) => c.kind === 'recall')
  return <div>
    <label className="mt-5 flex flex-col sm:flex-row sm:items-center gap-2 text-sm font-medium">Phạm vi luyện tập
      <select value={expanded ? 'all' : 'learned'} onChange={(e) => setExpanded(e.target.value === 'all')} className="min-h-11 rounded-xl border border-line bg-surface px-3 py-2">
        <option value="learned">{hasLearned ? 'Chỉ từ đã học' : '4 âm mẫu nhập môn'}</option>
        <option value="all">Mở rộng: toàn bộ giáo trình HSK 1–3</option>
      </select>
    </label>
    {!expanded && !hasLearned && <p className="mt-2 text-sm text-muted">Bạn chưa có từ đã học. Hãy luyện bốn âm mẫu hoặc bắt đầu 7 buổi nhập môn trước.</p>}
    <div key={`${expanded}-${pool.map((w) => w.hanzi).join('|')}`}>{children(pool)}</div>
  </div>
}
