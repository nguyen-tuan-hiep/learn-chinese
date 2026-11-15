import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SOUND_GUIDE, SOUND_GROUPS, TONE_GUIDE, type SoundKind } from '@/data/pronunciationGuide'
import { Glass } from '@/components/ui/Glass'
import { Chevron } from '@/components/ui/Disclosure'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { ToneContour } from '@/components/hanzi/ToneContour'

const field = 'mt-1.5 block min-h-11 w-full rounded-xl bg-fill px-3 text-body font-normal text-label outline-none placeholder:text-tertiary-label focus-visible:ring-2 focus-visible:ring-[var(--color-tint)]'
const solid = 'bg-[var(--glass-solid)]'

/** Searchable pinyin chart: tones plus every initial and final, grouped in glass panels with sticky headers on wide screens. */
export function PronunciationChart({ kind, searchable = false }: { kind?: SoundKind | 'tones'; searchable?: boolean }) {
  const [filter, setFilter] = useState<SoundKind | 'tones' | 'all'>(kind ?? 'all')
  const [query, setQuery] = useState('')
  const active = searchable ? filter : kind ?? 'all'
  const normalized = query.toLocaleLowerCase().normalize('NFD').replace(/ü/g, 'ü').replace(/[̀-ͯ]/g, '').replace(/v/g, 'ü')
  const match = (value: string) => value.toLocaleLowerCase().normalize('NFD').replace(/ü/g, 'ü').replace(/[̀-ͯ]/g, '').includes(normalized)
  const sounds = SOUND_GUIDE.filter(s => (active === 'all' || active === s.kind) && (!query || match(`${s.label} ${s.pinyin} ${s.approximate}`)))
  const tones = (active === 'all' || active === 'tones') ? TONE_GUIDE.filter(t => !query || match(`${t.label} ${t.pinyin}`)) : []
  return <div className="mt-4 min-w-0 space-y-4">
    <p className="rounded-card bg-warning-soft px-4 py-3 text-subhead leading-relaxed">The “sounds like” hints are only approximate. Listen to the sample syllable and adjust your mouth; do not read pinyin as if it were English. Audio uses the Chinese voice on your device. <Link to="/settings" className="font-medium text-tint-text underline">Check the voice</Link> if you cannot hear it.</p>
    {searchable && <Glass className="grid gap-3 p-4 sm:grid-cols-2">
      <label className="text-subhead font-medium">Find a pinyin sound
        <span className="relative block">
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 mt-[3px] -translate-y-1/2 text-secondary-label" />
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="For example: ü, zh, ang…" className={`${field} pl-9`} />
        </span>
      </label>
      <label className="text-subhead font-medium">Sound group
        <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)} className={field}><option value="all">All</option><option value="initials">Initials</option><option value="finals">Finals</option><option value="tones">Tones</option></select>
      </label>
    </Glass>}
    {tones.length > 0 && <Glass as="section" aria-label="Tone chart" className="p-4 sm:p-5">
      <h3 className="text-headline">Tones</h3>
      <p className="text-subhead text-secondary-label">Listen to both the pitch and the length.</p>
      <ul className="mt-3 divide-y divide-separator">{tones.map(t => <li key={t.tone} className="flex items-center gap-3 py-3">
        {t.tone !== 5 && <div className="hidden sm:block"><ToneContour tone={t.tone} size={48} animate={false} /></div>}
        <div className="min-w-0 flex-1">
          <p className="text-headline">{t.label} <span className="ml-1 text-secondary-label">{t.mark}</span></p>
          <p className="mt-0.5 text-subhead">{t.direction}</p>
          <p className="mt-0.5 text-footnote text-secondary-label">{t.caution}</p>
          <p className="mt-1.5 text-title3">{t.pinyin} <span lang="zh-CN" className="font-han">{t.say}</span></p>
        </div>
        <SpeakButton text={t.say} />
      </li>)}</ul>
    </Glass>}
    {SOUND_GROUPS.map(group => {
      const rows = sounds.filter(s => s.group === group.id)
      if (!rows.length) return null
      return <Glass as="details" key={`${group.id}-${query}-${active}`} open={searchable || group.id === 'initials-1' || group.id === 'vowels'} className="group min-w-0 px-4 sm:px-5 [&[open]>summary_svg]:rotate-180">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 py-2 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0 flex-1 text-headline">{group.title} <span className="text-subhead font-normal text-secondary-label">· {rows.length} sounds</span></span>
          <Chevron open={false} />
        </summary>
        {/* Wide screens: a scrolling table whose header row and first column stay put. */}
        <div className="-mx-4 max-h-[70vh] overflow-auto pb-3 sm:mx-0 sm:pb-4">
          <table className="block w-full text-left text-subhead sm:table sm:border-separate sm:border-spacing-0">
            <caption className="sr-only">{group.title}: sound hints, mouth position and samples</caption>
            <thead className="hidden sm:table-header-group"><tr>{['Pinyin', 'Sounds like', 'Mouth and notes', 'Listen'].map((heading, i) => <th key={heading} scope="col" className={`sticky top-0 z-20 border-b border-separator p-3 text-footnote font-semibold text-secondary-label ${solid} ${i === 0 ? 'left-0 z-30 w-[12%]' : i === 1 ? 'w-[23%]' : i === 3 ? 'w-[20%]' : ''}`}>{heading}</th>)}</tr></thead>
            <tbody className="grid gap-2 px-4 sm:table-row-group sm:px-0">{rows.map(s => <tr key={s.id} className="grid grid-cols-[4rem_minmax(0,1fr)] rounded-2xl bg-fill p-3 sm:table-row sm:rounded-none sm:bg-transparent sm:p-0">
              <th scope="row" className={`text-title2 font-semibold sm:sticky sm:left-0 sm:z-10 sm:border-b sm:border-separator sm:p-3 sm:align-top ${solid}`.replace(solid, 'sm:bg-[var(--glass-solid)]')}>{s.label}</th>
              <td className="min-w-0 sm:border-b sm:border-separator sm:p-3 sm:align-top"><span className="block text-caption text-secondary-label sm:hidden">Sounds like</span><span className="font-medium">{s.approximate}</span></td>
              <td className="col-span-2 mt-3 sm:mt-0 sm:border-b sm:border-separator sm:p-3 sm:align-top"><p>{s.mouth}</p><p className="mt-1 text-footnote text-secondary-label">{s.caution}</p></td>
              <td className="col-span-2 mt-3 sm:mt-0 sm:border-b sm:border-separator sm:p-3 sm:align-top"><div className="flex items-center gap-2"><SpeakButton text={s.say} /><span>{s.pinyin}<span lang="zh-CN" className="font-han ml-1">{s.say}</span></span></div></td>
            </tr>)}</tbody>
          </table>
        </div>
      </Glass>
    })}
    {!sounds.length && !tones.length && <p role="status" className="text-subhead text-secondary-label">No matching sounds. Try other pinyin or pick All.</p>}
    {active !== 'tones' && <p className="text-footnote leading-relaxed text-secondary-label">Spelling rules: y/w write syllables that start with i/u/ü (yi, wu, yu…) and are not counted among the 21 initials above. iu/ui/un are short spellings of iou/uei/uen after an initial; ü drops its dots after j/q/x/y.</p>}
  </div>
}
