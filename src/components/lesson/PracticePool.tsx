import { useMemo, useState } from 'react'
import { practicePool, type PracticeWord } from '@/lib/practicePool'
import { useStudyData } from '@/lib/useStudyData'

/** Scope picker (learned words or all HSK words) that hands the resulting word pool to its children. */
export function PracticePool({ children }: { children: (pool: PracticeWord[]) => React.ReactNode }) {
  const { loaded, cards } = useStudyData()
  const [expanded, setExpanded] = useState(false)
  const pool = useMemo(() => practicePool(cards, expanded), [cards, expanded])
  if (!loaded) return <p role="status" className="mt-6 text-subhead text-secondary-label">Loading learned words…</p>
  const hasLearned = cards.some((c) => c.kind === 'recall')
  return <div>
    <label className="mt-5 flex flex-col gap-2 text-subhead font-medium text-secondary-label sm:flex-row sm:items-center">Practice range
      <select value={expanded ? 'all' : 'learned'} onChange={(e) => setExpanded(e.target.value === 'all')} className="h-11 rounded-2xl bg-fill px-3 text-body font-normal text-label outline-none focus:ring-2 focus:ring-tint">
        <option value="learned">{hasLearned ? 'Learned words only' : 'The 4 starter syllables'}</option>
        <option value="all">Extended: HSK 1–6 vocabulary (including unlearned words)</option>
      </select>
    </label>
    {expanded && <p className="mt-2 text-footnote leading-snug text-secondary-label">The extended range covers lesson words and extra words from all 6 HSK levels, including ones you have not learned.</p>}
    {!expanded && !hasLearned && <p className="mt-2 text-footnote leading-snug text-secondary-label">You have no learned words yet. Practise the four starter syllables, or study the Intro and Tones parts first.</p>}
    <div key={`${expanded}-${pool.map((w) => w.hanzi).join('|')}`}>{children(pool)}</div>
  </div>
}
