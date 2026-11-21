import { useEffect, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, PenLine } from 'lucide-react'
import { RADICALS, RADICAL_GROUPS, type Radical, type RadicalGroup } from '@/data/radicals'
import radicalChars from '@/data/radicalChars.json'
import { PageHeader } from '@/components/ui/PageHeader'
import { Segmented } from '@/components/ui/Segmented'
import { Sheet } from '@/components/ui/Sheet'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { charDataOf, type CharData } from '@/components/hanzi/ColoredHanzi'
import { StrokeOrderGuide } from '@/components/hanzi/StrokeOrder'
import { riseIn } from '@/components/ui/motion'
import { levelColor } from '@/lib/palette'
import { useStudyTimer } from '@/lib/useStudyTimer'

/** [character, pinyin, meaning, the part beside the radical or ""] in course order. */
type Example = [string, string, string, string]
const CHARS = radicalChars as unknown as Record<string, Example[]>

// Each theme borrows one of the level pastels, so the page sits in the same palette as the HSK tiles.
const GROUP_TINT: Record<RadicalGroup, number> = { people: 5, body: 6, mind: 4, nature: 1, action: 2, things: 3 }
const tint = (r: Radical) => ({ '--tint': levelColor(GROUP_TINT[r.group]) }) as CSSProperties
const examples = (r: Radical) => CHARS[r.form] ?? []
const title = (s: string) => s[0].toUpperCase() + s.slice(1)

type Filter = 'all' | RadicalGroup
const FILTERS = [{ value: 'all' as Filter, label: 'All' }, ...RADICAL_GROUPS.map((g) => ({ value: g.id as Filter, label: g.label }))]

/** A character drawn from its strokes, with the radical's strokes in the theme colour. Falls back to plain text. */
function RadicalGlyph({ char, className = '' }: { char: string; className?: string }) {
  const [data, setData] = useState<CharData | null | undefined>(undefined)
  useEffect(() => {
    let live = true
    charDataOf(char).then((d) => { if (live) setData(d) })
    return () => { live = false }
  }, [char])
  if (data === null) return <span lang="zh-CN" className={`font-han grid place-items-center ${className}`}>{char}</span>
  return <svg viewBox="0 0 1024 1024" role="img" aria-label={char} className={className}>
    {data && <g transform="translate(0, 900) scale(1, -1)">
      {data.strokes.map((d, i) => <path key={i} d={d} fill={data.radStrokes.includes(i) ? 'var(--rad-ink)' : 'currentColor'} />)}
    </g>}
  </svg>
}

/** "氵 + 可": the radical in its colour, plus the other part. */
function Formula({ radical, other, className = '' }: { radical: string; other: string; className?: string }) {
  return <span lang="zh-CN" className={`font-han inline-flex items-baseline gap-1.5 ${className}`}>
    <span className="text-(--rad-ink)">{radical}</span>{other && <><span className="font-sans text-[0.7em] text-tertiary-label">+</span><span>{other}</span></>}
  </span>
}

function RadicalTile({ radical, onOpen }: { radical: Radical; onOpen: () => void }) {
  return <motion.li variants={riseIn}>
    <button type="button" onClick={onOpen} style={tint(radical)} aria-label={`${radical.form}, ${radical.meaning}`}
      className="glass-card rad-tint relative flex aspect-square w-full cursor-pointer flex-col justify-between rounded-[1.75rem] p-4 text-left transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-0.5 active:scale-[0.97]">
      {radical.full && <span lang="zh-CN" className="font-han absolute top-3.5 right-4 text-footnote opacity-60">{radical.full}</span>}
      <span lang="zh-CN" className="font-han text-[2.75rem] leading-none text-(--rad-ink)">{radical.form}</span>
      <span className="min-w-0">
        <span className="block truncate text-subhead font-bold">{title(radical.meaning)}</span>
        <span className="block text-caption opacity-70">{radical.pinyin}</span>
      </span>
    </button>
  </motion.li>
}

/** Radical of the day: the radical large, its story, and a few characters it builds. */
function Featured({ radical, onOpen }: { radical: Radical; onOpen: () => void }) {
  const built = examples(radical).filter((e) => e[3]).slice(0, 3)
  return <section aria-label="Radical of the day" style={tint(radical)}
    className="on-light glass-card glow-tiles rad-tint relative flex flex-wrap items-center gap-6 rounded-[2.25rem] p-5 sm:p-7">
    <div className="relative grid size-32 shrink-0 place-items-center rounded-[1.75rem] bg-(--tile-chip) shadow-(--badge-shadow) sm:size-36">
      <span lang="zh-CN" className="font-han text-[5.5rem] leading-none text-(--rad-ink)">{radical.form}</span>
      {radical.full && <span lang="zh-CN" className="font-han absolute right-3 bottom-2.5 text-subhead text-secondary-label">{radical.full}</span>}
    </div>
    <div className="min-w-0 max-w-xl flex-1 basis-64">
      <p className="text-footnote font-semibold text-secondary-label">Radical of the day</p>
      <h2 className="mt-0.5 font-display text-title1 font-extrabold">{title(radical.meaning)} <span className="text-callout font-semibold text-secondary-label">{radical.pinyin}</span></h2>
      <p className="mt-1 text-subhead text-secondary-label text-pretty">{radical.note}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {built.map(([c, , meaning, other]) => <span key={c} className="inline-flex items-center gap-2 rounded-full bg-(--glass-solid) py-1.5 pr-3.5 pl-3 text-title3 text-label shadow-(--badge-shadow)">
          <Formula radical={radical.form} other={other} /><span className="text-subhead text-tertiary-label">=</span><span lang="zh-CN" className="font-han">{c}</span>
          <span className="text-caption text-secondary-label">{meaning}</span>
        </span>)}
        <button type="button" onClick={onOpen} className="ink-pill inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full pr-3.5 pl-4 text-footnote font-bold shadow-(--cta-shadow)">
          All {examples(radical).length} characters<ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={2.6} />
        </button>
      </div>
    </div>
  </section>
}

const PAGE = 24

/** The radical up close: what it means, then every course character it heads, radical strokes in colour. */
function RadicalSheet({ radical, onClose }: { radical: Radical | null; onClose: () => void }) {
  const [all, setAll] = useState(false)
  // A character (or the radical itself) being written; the stroke guide replaces the list in the same sheet.
  const [writing, setWriting] = useState<{ hanzi: string; pinyin?: string; meaning?: string } | null>(null)
  useEffect(() => { setAll(false); setWriting(null) }, [radical])
  const list = radical ? examples(radical) : []
  return <Sheet open={!!radical} onClose={onClose} label={writing ? `How to write ${writing.hanzi}` : radical ? `${radical.meaning} radical` : 'Radical'} tall>
    {radical && writing && <div className="p-5 sm:p-7">
      <button type="button" onClick={() => setWriting(null)}
        className="-ml-2 mb-3 inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full pr-3 pl-1.5 text-subhead font-semibold text-secondary-label hover:bg-fill hover:text-label">
        <ChevronLeft aria-hidden="true" className="size-5" />{title(radical.meaning)}
      </button>
      <StrokeOrderGuide key={writing.hanzi} hanzi={writing.hanzi} pinyin={writing.pinyin} meaning={writing.meaning} />
    </div>}
    {radical && !writing && <div style={tint(radical)} className="rad-tint p-5 sm:p-7">
      <div className="flex items-center gap-4 pr-10">
        <div className="relative grid size-20 shrink-0 place-items-center rounded-3xl bg-[color-mix(in_srgb,var(--tint)_32%,transparent)]">
          <span lang="zh-CN" className="font-han text-[3.25rem] leading-none text-(--rad-ink)">{radical.form}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-title2 font-extrabold">{title(radical.meaning)}</h2>
          <p className="text-subhead text-secondary-label">{radical.pinyin}{radical.full && <> · from <span lang="zh-CN" className="font-han">{radical.full}</span></>}</p>
        </div>
        <SpeakButton text={radical.full ?? radical.form} />
        <button type="button" onClick={() => setWriting({ hanzi: radical.full ?? radical.form, pinyin: radical.pinyin, meaning: radical.meaning })}
          aria-label={`How to write ${radical.full ?? radical.form}`} title="How to write"
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-fill text-label transition-colors hover:bg-separator"><PenLine aria-hidden="true" className="size-[1.125rem]" /></button>
      </div>
      <p className="mt-4 text-callout text-pretty">{radical.note}</p>
      <h3 className="mt-6 mb-3 text-footnote font-semibold text-secondary-label">In your course · {list.length} characters · tap one to write it</h3>
      <ul className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
        {(all ? list : list.slice(0, PAGE)).map(([c, pinyin, meaning, other]) => <li key={c}>
          <button type="button" onClick={() => setWriting({ hanzi: c, pinyin, meaning })} aria-label={`How to write ${c}, ${pinyin}, ${meaning}`}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-fill p-2 pr-3 text-left transition-colors hover:bg-separator">
            <RadicalGlyph char={c} className="size-14 shrink-0 rounded-xl bg-(--glass-thin) p-1.5 text-label" />
            <span className="min-w-0 flex-1">
              <Formula radical={radical.form} other={other} className="text-headline" />
              <span className="block truncate text-footnote text-secondary-label">{pinyin} · {meaning}</span>
            </span>
            <PenLine aria-hidden="true" className="size-4 shrink-0 text-tertiary-label" />
          </button>
        </li>)}
      </ul>
      {!all && list.length > PAGE && <button type="button" onClick={() => setAll(true)}
        className="mx-auto mt-4 flex min-h-11 cursor-pointer items-center rounded-full bg-fill px-5 text-subhead font-semibold hover:bg-separator">Show all {list.length}</button>}
    </div>}
  </Sheet>
}

export function RadicalsPage() {
  useStudyTimer()
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState<Radical | null>(null)
  // Same radical all day, a new one tomorrow.
  const today = RADICALS[Math.floor(Date.now() / 86_400_000) % RADICALS.length]
  const groups = RADICAL_GROUPS.filter((g) => filter === 'all' || g.id === filter)
  return <div className="w-full min-w-0 space-y-6 pt-6 pb-12 sm:pt-8 lg:space-y-8">
    <PageHeader eyebrow="Building blocks of characters" title="Radicals" />
    <Featured radical={today} onOpen={() => setOpen(today)} />
    <Segmented label="Theme" options={FILTERS} value={filter} onChange={setFilter} />
    {groups.map((g) => <section key={g.id} aria-labelledby={`rad-${g.id}`}>
      <h2 id={`rad-${g.id}`} className="mb-3.5 font-display text-title3 font-extrabold">{g.label}</h2>
      <motion.ul className="grid grid-cols-3 gap-3.5 min-[560px]:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7" initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}>
        {RADICALS.filter((r) => r.group === g.id).map((r) => <RadicalTile key={r.form} radical={r} onOpen={() => setOpen(r)} />)}
      </motion.ul>
    </section>)}
    <RadicalSheet radical={open} onClose={() => setOpen(null)} />
  </div>
}
