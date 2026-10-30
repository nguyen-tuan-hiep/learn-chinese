import { useState } from 'react'
import type { Radical } from '@/data/radicals'
import { radicalFamily, type FamilyMember, type FamilyRole } from '@/lib/radicalFamily'
import { useStudyData } from '@/lib/useStudyData'
import { ColoredHanzi } from './ColoredHanzi'
import { Pinyin } from './Pinyin'
import { SpeakButton } from './SpeakButton'

const MAP_SIZE = 8
const ROLE: Record<FamilyRole, { label: string; description: string; stroke: string; soft: string; dash?: string }> = {
  semantic: { label: 'Bộ gợi nghĩa', description: 'Giúp gợi liên hệ đến ý nghĩa của chữ.', stroke: 'var(--color-jade)', soft: 'var(--color-jade-soft)' },
  phonetic: { label: 'Bộ gợi âm', description: 'Giúp gợi ý cách đọc của chữ.', stroke: 'var(--color-gold)', soft: 'var(--color-gold-soft)' },
  part: { label: 'Thành phần cấu tạo', description: 'Có trong chữ; dữ liệu chưa xác định vai trò gợi nghĩa hoặc gợi âm.', stroke: 'var(--color-blue)', soft: 'var(--color-blue-soft)' },
  nested: { label: 'Nằm trong thành phần khác', description: 'Bộ nằm bên trong một thành phần của chữ, được nối bằng nét đứt.', stroke: 'var(--color-blue)', soft: 'var(--color-blue-soft)', dash: '4 4' },
  self: { label: 'Chính là bộ này', description: 'Chữ có cùng hình dạng với bộ đang học.', stroke: 'var(--color-ink)', soft: 'var(--color-sunken)' },
}

const clip = (text: string, n: number) => (text.length > n ? `${text.slice(0, n - 1)}…` : text)

function Branch({ member, learned }: { member: FamilyMember; learned: Set<string> }) {
  return <div className="mt-4 rounded-xl bg-sunken p-4" aria-live="polite">
    <div className="flex items-start gap-4">
      <span className="font-han text-6xl leading-none">{member.char}</span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2"><Pinyin text={member.pinyin} className="text-xl" /><SpeakButton text={member.char} size="sm" />{member.hanViet && <span className="font-bold tracking-wider text-gold uppercase">{member.hanViet}</span>}</div>
        <p className="mt-1 font-semibold">{member.gloss}</p>
        {member.parts.length > 0 && <p className="mt-1 text-sm text-muted">Ghép: <span className="font-han text-ink text-base">{member.parts.join(' + ')}</span> · {ROLE[member.role].label}{member.via && <> (qua <span className="font-han text-ink">{member.via}</span>)</>}</p>}
        <p className="mt-2 border-l-2 pl-2 text-xs leading-relaxed text-muted" style={{ borderColor: ROLE[member.role].stroke }}>{ROLE[member.role].description}</p>
      </div>
    </div>
    {member.story && <p className="mt-3 text-sm leading-relaxed border-l-2 border-gold pl-3">{member.story}</p>}
    <p className="mt-4 text-sm font-semibold">Từ vựng có chữ {member.char} ({member.words.length})</p>
    <ul className="mt-2 grid sm:grid-cols-2 gap-2">{member.words.slice(0, 8).map((w) => <li key={w.key} className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm">
      <SpeakButton text={w.hanzi} size="sm" />
      <div className="min-w-0"><span className="font-han text-lg">{w.hanzi}</span> <Pinyin text={w.pinyin} /> <span className="text-muted">· {w.meaning}</span></div>
      {learned.has(w.key) && <span className="ml-auto shrink-0 text-xs font-semibold text-jade" title="Đã học">✓</span>}
    </li>)}</ul>
    {member.words.length > 8 && <p className="mt-2 text-xs text-muted">Và {member.words.length - 8} từ khác trong giáo trình.</p>}
  </div>
}

/**
 * A radical in the middle, course characters built with it around it, and the words of the chosen character below.
 * With `focus` (this lesson's characters) only those and `dim` (characters from earlier lessons, drawn faded) are shown,
 * each drawn with the `highlight` radicals coloured.
 */
export function RadicalMindmap({ radical, focus, dim = [], highlight, semanticOnly = false }: { radical: Radical; focus?: string[]; dim?: string[]; highlight?: Map<number, string>; semanticOnly?: boolean }) {
  const { cards } = useStudyData()
  const family = radicalFamily(radical).filter((member) => !semanticOnly || member.role === 'semantic')
  const others = family.filter((m) => m.role !== 'self')
  const shown = focus ? [...others.filter((m) => focus.includes(m.char)), ...others.filter((m) => dim.includes(m.char))] : others
  const ring = shown.slice(0, MAP_SIZE)
  const rest = focus ? [] : others.slice(MAP_SIZE)
  const inLesson = focus ? ring.filter((m) => focus.includes(m.char)).length : 0
  const colours = highlight ?? new Map([[radical.id, 'var(--color-cinnabar)']])
  const [selected, setSelected] = useState(ring[0]?.char)
  const learned = new Set(cards.filter((c) => c.kind === 'recall').map((c) => c.ref))
  const chosen = family.find((m) => m.char === selected)
  if (!ring.length) return semanticOnly ? <p className="rounded-xl bg-sunken p-4 text-sm text-muted">Chưa có chữ trong dữ liệu hiện tại được xác định bộ này có vai trò gợi nghĩa.</p> : null
  const C = 210, R = 145
  const at = (i: number) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / ring.length
    return { x: C + R * Math.cos(angle), y: C + R * Math.sin(angle) }
  }
  return <div>
    {semanticOnly ? <h3 className="font-bold">Bộ <span className="font-han">{radical.writingGlyph}</span> gợi nghĩa trong {others.length} chữ của giáo trình</h3> : focus ? <h3 className="font-bold">Trong bài này, bộ <span className="font-han">{radical.writingGlyph}</span> có trong {inLesson} chữ{ring.length > inLesson && `, và ${ring.length - inLesson} chữ bạn đã học`}</h3>
      : <h3 className="font-bold">Sơ đồ chữ: bộ <span className="font-han">{radical.writingGlyph}</span> ghép ra {others.length} chữ trong giáo trình</h3>}
    <p className="text-sm text-muted mt-1">{semanticOnly ? 'Sơ đồ chỉ hiển thị các chữ có vai trò gợi nghĩa đã được xác định trong dữ liệu. ' : ''}Bấm vào một chữ để xem cách ghép và các từ vựng chứa chữ đó.{focus && ring.length > inLesson && ' Chữ mờ là chữ ở bài trước.'}</p>
    <svg viewBox="0 0 420 430" className="mt-3 w-full max-w-md mx-auto block select-none" role="group" aria-label={`Sơ đồ chữ của bộ ${radical.writingGlyph}`}>
      {ring.map((m, i) => { const p = at(i); return <line key={m.char} x1={C} y1={C} x2={p.x} y2={p.y} stroke={ROLE[m.role].stroke} strokeWidth={m.char === selected ? 3 : 1.5} strokeDasharray={ROLE[m.role].dash} opacity={m.char === selected ? 1 : 0.6} /> })}
      <circle cx={C} cy={C} r={48} fill="var(--color-cinnabar-soft)" stroke="var(--color-cinnabar)" strokeWidth={2} />
      <text x={C} y={C + 4} textAnchor="middle" dominantBaseline="middle" className="font-han" fill="var(--color-cinnabar)" fontSize={46}>{radical.writingGlyph}</text>
      <text x={C} y={C + 66} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-ink)" stroke="var(--color-surface)" strokeWidth={4} paintOrder="stroke">{clip(radical.meaning, 18)}</text>
      {ring.map((m, i) => {
        const p = at(i), on = m.char === selected, faded = !!focus && !focus.includes(m.char)
        return <g key={m.char} role="button" tabIndex={0} aria-pressed={on} aria-label={`Chữ ${m.char}: ${m.gloss}${faded ? ' (đã học)' : ''}`} opacity={faded && !on ? 0.5 : 1} className="cursor-pointer focus:outline-none [&:focus-visible>circle]:stroke-[3px]"
          onClick={() => setSelected(m.char)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(m.char) } }}>
          <circle cx={p.x} cy={p.y} r={32} fill={on ? ROLE[m.role].soft : 'var(--color-surface)'} stroke={ROLE[m.role].stroke} strokeWidth={on ? 3 : 2} />
          <ColoredHanzi char={m.char} highlight={colours} size={40} at={p} baseFill="var(--color-ink)" />
          <text x={p.x} y={p.y + 48} textAnchor="middle" fontSize={12} fill="var(--color-muted)" stroke="var(--color-surface)" strokeWidth={4} paintOrder="stroke">{clip(m.gloss.replace(/^trong [^:]+: /, ''), 14)}</text>
        </g>
      })}
    </svg>
    <ul aria-label="Chú thích vai trò của bộ trong chữ" className="mx-auto grid max-w-2xl grid-cols-1 gap-3 text-xs sm:grid-cols-2">
      {(['semantic', 'phonetic', 'part', 'nested'] as const).filter((role) => ring.some((m) => m.role === role)).map((role) => <li key={role} className="flex items-start gap-2">
        <svg width="22" height="16" className="shrink-0" aria-hidden><line x1="0" y1="8" x2="22" y2="8" stroke={ROLE[role].stroke} strokeWidth="2" strokeDasharray={ROLE[role].dash} /></svg>
        <div><span className="font-semibold">{ROLE[role].label}</span><p className="mt-0.5 leading-relaxed text-muted">{ROLE[role].description}</p></div>
      </li>)}
    </ul>
    {chosen && <Branch member={chosen} learned={learned} />}
    {rest.length > 0 && <details className="mt-4 text-sm"><summary className="cursor-pointer font-semibold">{semanticOnly ? `Còn ${rest.length} chữ khác có bộ này gợi nghĩa` : `Còn ${rest.length} chữ khác có bộ này`}</summary>
      <div className="mt-2 flex flex-wrap gap-1.5">{rest.map((m) => <button key={m.char} type="button" aria-label={`Chữ ${m.char}: ${m.gloss}`} aria-pressed={m.char === selected} onClick={() => setSelected(m.char)}
        className="min-h-11 min-w-11 rounded-lg border border-line bg-surface font-han text-xl text-ink hover:bg-sunken" style={m.char === selected ? { backgroundColor: ROLE[m.role].soft, borderColor: ROLE[m.role].stroke } : undefined}>{m.char}</button>)}</div>
    </details>}
  </div>
}
