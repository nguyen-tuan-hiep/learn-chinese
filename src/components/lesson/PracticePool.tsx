import { useMemo, useState } from 'react'
import { practicePool, type PracticeWord } from '@/lib/practicePool'
import { useStudyData } from '@/lib/useStudyData'

/** Scope picker (learned words or all HSK words) that hands the resulting word pool to its children. */
export function PracticePool({ children }: { children: (pool: PracticeWord[]) => React.ReactNode }) {
  const { loaded, cards } = useStudyData()
  const [expanded, setExpanded] = useState(false)
  const pool = useMemo(() => practicePool(cards, expanded), [cards, expanded])
  if (!loaded) return <p role="status" className="mt-6 text-subhead text-secondary-label">Đang tải từ đã học…</p>
  const hasLearned = cards.some((c) => c.kind === 'recall')
  return <div>
    <label className="mt-5 flex flex-col gap-2 text-subhead font-medium text-secondary-label sm:flex-row sm:items-center">Phạm vi luyện tập
      <select value={expanded ? 'all' : 'learned'} onChange={(e) => setExpanded(e.target.value === 'all')} className="h-11 rounded-2xl bg-fill px-3 text-body font-normal text-label outline-none focus:ring-2 focus:ring-tint">
        <option value="learned">{hasLearned ? 'Chỉ từ đã học' : '4 âm mẫu nhập môn'}</option>
        <option value="all">Mở rộng: từ vựng HSK 1–6 (cả từ chưa học)</option>
      </select>
    </label>
    {expanded && <p className="mt-2 text-footnote leading-snug text-secondary-label">Phạm vi mở rộng gồm từ trong bài học và từ bổ sung của cả 6 cấp HSK, kể cả từ bạn chưa học.</p>}
    {!expanded && !hasLearned && <p className="mt-2 text-footnote leading-snug text-secondary-label">Bạn chưa có từ đã học. Hãy luyện bốn âm mẫu hoặc học phần Giới thiệu và Thanh điệu trước.</p>}
    <div key={`${expanded}-${pool.map((w) => w.hanzi).join('|')}`}>{children(pool)}</div>
  </div>
}
