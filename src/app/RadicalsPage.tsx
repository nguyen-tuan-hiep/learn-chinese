import { cheerAnswer } from '@/store/mascot'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Check, ChevronRight, PartyPopper, PenLine, Search, X, XCircle, CheckCircle2 } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Glass } from '@/components/ui/Glass'
import { spring, Rise, Stagger } from '@/components/ui/motion'
import { Badge } from '@/components/ui/Badge'
import { Disclosure } from '@/components/ui/Disclosure'
import { LargeTitle } from '@/components/ui/PageHeader'
import { ListGroup, ListRow } from '@/components/ui/ListGroup'
import { Segmented } from '@/components/ui/Segmented'
import { Sheet } from '@/components/ui/Sheet'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { StrokeWriter } from '@/components/hanzi/StrokeWriter'
import { FreehandWriter } from '@/components/hanzi/FreehandWriter'
import { RADICALS, RADICAL_BY_ID, RADICAL_LESSONS, radicalLesson, type Radical } from '@/data/radicals'
import { learnedRadicalIds, TAUGHT_RADICALS } from '@/lib/lessonRadicals'
import { firstRadicalLesson } from '@/lib/lessonRadicalStudy'
import { lessonName } from '@/data/course'
import { radicalExample, radicalPosition } from '@/lib/radicalExamples'
import { radicalFamily } from '@/lib/radicalFamily'
import { RadicalMindmap } from '@/components/hanzi/RadicalMindmap'
import { ComposeQuiz } from '@/components/lesson/ComposeQuiz'
import { RadicalLessonSkeleton, RadicalsSkeleton } from '@/components/radicals/RadicalsSkeleton'
import { RadicalLessonHeader } from '@/components/radicals/RadicalLessonHeader'
import { markPart } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'

/** Progress ring in the app accent. `value` is 0–1. */
function FitnessRing({ value, size = 56, stroke = 7 }: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.min(1, Math.max(0, value))
  return <span className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size }} role="img" aria-label={`${Math.round(v * 100)}% of course radicals learned`}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke="color-mix(in srgb, var(--tint) 45%, transparent)" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} stroke="var(--deep)"
        initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - v), opacity: v > 0 ? 1 : 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
    </svg>
    <span aria-hidden="true" className="absolute font-han text-title3 leading-none">部</span>
  </span>
}

/** Soft blue header of a radical: big glyph, number, meaning and form pills. Optional close button. */
function RadicalHero({ radical, onClose }: { radical: Radical; onClose?: () => void }) {
  const pill = 'inline-flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-1 text-footnote font-medium text-label dark:bg-black/25'
  return <div className="relative overflow-hidden rounded-card p-5" style={{ background: 'var(--gradient-level-1)' }}>
    <svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute -top-16 -right-16 size-64 text-white/45" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="100" cy="100" r="96" /><circle cx="100" cy="100" r="78" /><circle cx="100" cy="100" r="60" /><circle cx="100" cy="100" r="42" />
    </svg>
    {onClose && <button type="button" onClick={onClose} aria-label="Close radical details" className="glass absolute top-3 right-3 grid size-11 cursor-pointer place-items-center rounded-full text-label transition-transform active:scale-90"><X aria-hidden="true" className="size-5" /></button>}
    <div className="relative flex items-center gap-4 pr-12">
      <span lang="zh-CN" className="font-han text-[5.5rem] leading-none text-label">{radical.writingGlyph}</span>
      <div className="min-w-0">
        <p className="text-footnote font-medium tabular-nums text-label/75">Radical {radical.id}/214 · {radical.strokes} stroke{radical.strokes === 1 ? '' : 's'}</p>
        <h2 className="mt-0.5 text-title2 text-balance">{radical.meaning}</h2>
      </div>
    </div>
    <div className="relative mt-4 flex flex-wrap gap-2">
      <span className={pill}>Base form <span lang="zh-CN" className="font-han text-callout">{radical.glyph}</span></span>
      {radical.variants.length > 0 && <span className={pill}>Other forms <span lang="zh-CN" className="font-han text-callout">{radical.variants.join(' · ')}</span></span>}
      <span className={pill}>Position: {radicalPosition(radical.variants)}</span>
    </div>
  </div>
}

/** The one-paragraph note under a radical: its example character or the characters it gives meaning to. */
function RadicalNote({ radical, semanticOnly = false }: { radical: Radical; semanticOnly?: boolean }) {
  const example = radicalExample(radical.id)
  const family = radicalFamily(radical).filter((m) => semanticOnly ? m.role === 'semantic' : m.role !== 'self')
  return <p className="rounded-card bg-fill px-4 py-3 text-subhead leading-relaxed">
    {semanticOnly ? (family.length > 0 ? <>Radical <span className="font-han text-lg">{radical.writingGlyph}</span> hints at the meaning of <b>{family.length} course characters</b>: <span className="font-han text-lg">{family.slice(0, 6).map((member) => member.char).join(' ')}</span>{family.length > 6 && '…'}. Pick a character in the map below to see example words.</> : <>No character in the current data is known to use this radical as a meaning hint.</>) : <>
      {example ? <>In the course, <span className="font-han text-lg">{example.char}</span> uses radical <span className="font-han text-lg">{radical.glyph}</span>; you meet it in <span className="font-han">{example.word.hanzi}</span> ({example.word.meaning}).</> : <>The character <span className="font-han text-lg">{radical.glyph}</span> means “{radical.meaning}”. This radical does not appear in the current HSK course.</>}
      {family.length > 1 && <> It builds <b>{family.length} course characters</b>, such as <span className="font-han text-lg">{family.slice(0, 6).map((m) => m.char).join(' ')}</span>.</>}
    </>}
  </p>
}

/** Hero plus note of a radical, with the `#radical-N` anchor the practice sessions scroll to. */
function RadicalDetails({ radical, semanticOnly = false, onClose }: { radical: Radical; semanticOnly?: boolean; onClose?: () => void }) {
  return <div id={`radical-${radical.id}`} className="scroll-mt-24 space-y-3">
    <RadicalHero radical={radical} onClose={onClose} />
    <RadicalNote radical={radical} semanticOnly={semanticOnly} />
  </div>
}

/** Dictionary entry: course links and characters where this radical has a documented semantic role. `flat` drops the panel (inside a sheet). */
function RadicalEntry({ radical, learned, onClose, flat = false }: { radical: Radical; learned: boolean; onClose: () => void; flat?: boolean }) {
  const lesson = firstRadicalLesson(radical.id)
  const practice = radicalLesson(radical.id)
  const hasSemanticFamily = radicalFamily(radical).some((member) => member.role === 'semantic')
  const body = <div className="space-y-4">
    <RadicalDetails radical={radical} semanticOnly onClose={onClose} />
    <div className="grid grid-cols-1 gap-2 min-[400px]:flex min-[400px]:flex-wrap min-[400px]:items-center">
      {lesson ? <ButtonLink to={`/lesson/${lesson.id}`}><BookOpen aria-hidden="true" className="size-4" />Learn in {lessonName(lesson)}</ButtonLink> : <span className="text-subhead text-secondary-label">This radical is not taught in the current course.</span>}
      {practice && <ButtonLink to={`/radicals/${practice.id}#radical-${radical.id}`} variant="secondary"><PenLine aria-hidden="true" className="size-4" />Extra writing practice</ButtonLink>}
      {learned && <Badge tone="success" className="self-center"><Check aria-hidden="true" className="size-3.5" strokeWidth={3} />Learned</Badge>}
    </div>
    {hasSemanticFamily && <div className="rounded-card bg-fill p-4"><RadicalMindmap key={radical.id} radical={radical} semanticOnly /></div>}
  </div>
  if (flat) return <section aria-label={`Radical ${radical.writingGlyph}`}>{body}</section>
  return <Glass material="thick" as="section" aria-label={`Radical ${radical.writingGlyph}`} className="p-3 sm:p-4">{body}</Glass>
}

type Filter = 'course' | 'learned' | 'all'
const FILTERS: [Filter, string][] = [['course', 'In the course'], ['learned', 'Learned'], ['all', 'All 214']]

/** The radical dictionary: orange ring summary, search and filter, tile grid, and a detail panel (xl) or sheet (below xl). */
export function RadicalsPage() {
  const { loaded, lessonState } = useStudyData()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('course')
  const wide = useMediaQuery('(min-width: 1280px)')
  const select = useCallback((id: number | null) => setParams(id === null ? {} : { r: String(id) }, { replace: true }), [setParams])
  if (!loaded) return <RadicalsSkeleton />
  const learned = learnedRadicalIds(lessonState)
  const selected = RADICAL_BY_ID.get(Number(params.get('r')))
  const needle = query.trim().toLocaleLowerCase('en-US')
  const pool = filter === 'all' ? RADICALS : filter === 'learned' ? TAUGHT_RADICALS.filter((r) => learned.has(r.id)) : TAUGHT_RADICALS
  const results = needle ? RADICALS.filter((radical) =>
    String(radical.id) === needle || [radical.glyph, radical.meaning, ...radical.variants].some((value) => value.toLocaleLowerCase('en-US').includes(needle))) : pool
  const known = TAUGHT_RADICALS.filter((r) => learned.has(r.id)).length
  return <Stagger gap={0.07} className="w-full min-w-0 space-y-8 pt-6 pb-12 sm:pt-8">
    <Rise><LargeTitle eyebrow="Look up · 214 radicals" title="Radical dictionary"
      aside={<div style={{ '--tint': 'var(--pastel-peach)', '--sun': '70% 170% at 100% 120%' } as CSSProperties} className="on-light glass-card glow-tiles relative flex w-full items-center gap-4 overflow-hidden rounded-[1.75rem] p-4 pr-8 sm:w-auto">
        <FitnessRing value={TAUGHT_RADICALS.length ? known / TAUGHT_RADICALS.length : 0} />
        <div><p className="text-headline tabular-nums">{known}/{TAUGHT_RADICALS.length} radicals learned</p><Link to="/lesson" className="text-subhead font-semibold text-secondary-label underline underline-offset-2 hover:text-label">Continue the path</Link></div>
      </div>} /></Rise>

    <Rise className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <section aria-label="Radical list" className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="glass relative flex h-11 min-w-60 flex-1 items-center gap-2 rounded-full pr-1 pl-4 focus-within:ring-2 focus-within:ring-label">
            <span className="sr-only">Search by shape, meaning or number</span>
            <Search aria-hidden="true" className="size-5 shrink-0 text-secondary-label" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" enterKeyHint="search" autoComplete="off" className="h-full min-w-0 flex-1 appearance-none bg-transparent text-body text-label outline-none placeholder:text-secondary-label [&::-webkit-search-cancel-button]:hidden" placeholder="Search: water, 氵, 85" />
            <AnimatePresence initial={false}>
              {query && <motion.button type="button" aria-label="Clear search" onClick={() => setQuery('')} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={spring.snappy}
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-secondary-label"><span className="grid size-5 place-items-center rounded-full bg-fill"><X aria-hidden="true" className="size-3" strokeWidth={3} /></span></motion.button>}
            </AnimatePresence>
          </label>
          <Segmented label="Filter radicals" fill className="w-full sm:w-auto" value={filter} onChange={setFilter} options={FILTERS.map(([value, label]) => ({ value, label }))} />
        </div>
        <p className="text-footnote tabular-nums text-secondary-label">{needle ? `${results.length} radicals match “${query.trim()}”` : filter === 'course' ? `${results.length} radicals in the course, in lesson order` : filter === 'learned' ? `${results.length} radicals you have learned` : 'All 214 radicals in Kangxi order'}</p>

        <ul key={`${filter}:${needle}`} className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5">
          {results.map((radical, i) => {
            const lesson = firstRadicalLesson(radical.id)
            const on = selected?.id === radical.id
            const done = learned.has(radical.id)
            return <motion.li key={radical.id} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...spring.snappy, delay: Math.min(i, 24) * 0.015 }}>
              <motion.button type="button" aria-pressed={on} onClick={() => select(radical.id)} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
                title={`${radical.writingGlyph} · ${radical.meaning}${lesson ? ` · ${lessonName(lesson)}` : ''}`}
                className={`glass-card relative flex h-[7.25rem] w-full min-w-0 cursor-pointer flex-col items-center justify-center rounded-[1.75rem] p-3 text-center ${on ? 'ring-2 ring-label' : ''}`}>
                <span className="absolute top-2 left-2.5 text-caption leading-none tabular-nums text-secondary-label">{radical.id}</span>
                {done && <span aria-label="Learned" className="absolute top-1.5 right-2 grid size-5 place-items-center rounded-full bg-white text-[#1d6d36] dark:bg-white/15 dark:text-[#7fdc98]"><Check aria-hidden="true" className="size-3.5" strokeWidth={3} /></span>}
                <span lang="zh-CN" className="font-han mt-2 text-4xl leading-tight text-label">{radical.writingGlyph}</span>
                <span className="w-full truncate text-subhead font-medium text-label">{radical.meaning}</span>
                <span className="w-full truncate text-caption text-secondary-label">{lesson ? `HSK ${lesson.level} · L${lesson.number}` : 'Not in the course'}</span>
              </motion.button>
            </motion.li>
          })}
        </ul>
        {results.length === 0 && <Glass className="p-6 text-center text-secondary-label">{filter === 'learned' && !needle ? 'You have not learned any radicals yet. Study the Radicals part of the first lesson to start.' : 'No matching radicals.'}</Glass>}
      </section>

      <aside aria-label="Radical details" className="hidden xl:sticky xl:top-6 xl:block">
        {selected ? <RadicalEntry radical={selected} learned={learned.has(selected.id)} onClose={() => select(null)} />
          : <Glass className="grid min-h-[17rem] place-items-center content-center gap-2 border-dashed p-10 text-center">
            <span aria-hidden="true" className="font-han text-5xl text-secondary-label">部</span>
            <p className="text-headline">Pick a radical to see its details</p>
            <p className="text-subhead text-secondary-label">Its meaning, variant forms, the lesson that teaches it and a map of the characters built from it.</p>
          </Glass>}
      </aside>
    </Rise>
    <Rise><PracticeSessions /></Rise>
    {/* Below xl the detail opens as a sheet over the grid instead of pushing it down. */}
    {!wide && <Sheet open={!!selected} onClose={() => select(null)} label={selected ? `Radical ${selected.writingGlyph}` : 'Radical details'}>
      {selected && <RadicalEntry radical={selected} learned={learned.has(selected.id)} onClose={() => select(null)} flat />}
    </Sheet>}
  </Stagger>
}

/** The old 43 radical sessions, kept as optional writing practice outside the course path: an iOS grouped list in a disclosure. */
function PracticeSessions() {
  const { lessonState } = useStudyData()
  return <Glass className="px-5"><Disclosure summary={<span className="block py-3"><span className="block text-headline">Extra radical writing practice</span><span className="block text-subhead text-secondary-label">43 sessions of 5 radicals · optional, not part of the path</span></span>}>
    <ListGroup className="mb-5 !border-0 !bg-fill !shadow-none !backdrop-filter-none">{RADICAL_LESSONS.map((lesson) => {
      const done = !!lessonState.get(lesson.id)?.done.radical
      return <ListRow key={lesson.id} to={`/radicals/${lesson.id}`} aria-label={`Session ${lesson.number}${done ? ', practised' : ''}`}
        leading={<span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-feature-radicals-soft text-subhead font-semibold tabular-nums text-tint-text">{lesson.number}</span>}
        title={<span className="font-medium">Session {lesson.number}</span>}
        subtitle={<span lang="zh-CN" className="font-han text-callout tracking-widest">{lesson.radicals.map((radical) => radical.writingGlyph).join(' ')}</span>}
        trailing={<span className="flex items-center gap-1.5">
          {done && <span className="inline-flex items-center gap-1 rounded-full bg-feature-radicals-soft px-2.5 py-0.5 text-caption font-semibold text-tint-text"><Check aria-hidden="true" className="size-3" strokeWidth={3} />Practised</span>}
          <ChevronRight aria-hidden="true" className="size-5 text-tertiary-label" />
        </span>} />
    })}</ListGroup>
  </Disclosure></Glass>
}

type Stage = 'recognize' | 'animate' | 'trace' | 'recall' | 'family'
const STAGES: Stage[] = ['recognize', 'animate', 'trace', 'recall', 'family']
const STAGE_LABELS = ['Recognise', 'Watch', 'Trace', 'Write', 'Build']

/** A practice session of five radicals: recognize, watch, trace, recall, then compose. Marks the lesson's radical part when finished. */
export function RadicalLessonPage() {
  useStudyTimer()
  const { id = '' } = useParams()
  const location = useLocation()
  const lesson = RADICAL_LESSONS.find((item) => item.id === id)
  const { loaded, lessonState } = useStudyData()
  const [index, setIndex] = useState(0)
  const [stage, setStage] = useState<Stage>('recognize')
  const [answer, setAnswer] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState<number | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [finished, setFinished] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false)
  useEffect(() => {
    const selected = Number(location.hash.match(/^#radical-(\d+)$/)?.[1])
    const nextIndex = lesson?.radicals.findIndex((radical) => radical.id === selected) ?? -1
    setIndex(nextIndex >= 0 ? nextIndex : 0)
    setStage('recognize'); setAnswer(null); setMistakes(null); setUnavailable(false); setFinished(false)
  }, [id, location.hash, lesson])
  if (!lesson) return <p className="pt-8 text-secondary-label">Radical session not found.</p>
  if (!loaded) return <RadicalLessonSkeleton id={id} />
  const radical = lesson.radicals[index]
  const choices = [radical, ...lesson.radicals.filter((item) => item.id !== radical.id).slice(0, 3)]
  const turn = radical.id % choices.length
  const options = [...choices.slice(turn), ...choices.slice(0, turn)]
  const nextLesson = RADICAL_LESSONS[lesson.number]
  const done = !!lessonState.get(lesson.id)?.done.radical
  // Rare radicals that build no course character skip the mindmap step.
  const hasFamily = radicalFamily(radical).some((m) => m.role !== 'self')
  const lastStep = index === lesson.radicals.length - 1 && (stage === 'family' || (stage === 'recall' && !hasFamily))
  const stageIndex = STAGES.indexOf(stage)
  const advance = async () => {
    const nextStage = STAGES[STAGES.indexOf(stage) + 1]
    if (nextStage && (nextStage !== 'family' || hasFamily)) { setStage(nextStage); setMistakes(null); setUnavailable(false); return }
    if (index < lesson.radicals.length - 1) { setIndex(index + 1); setStage('recognize'); setAnswer(null); setMistakes(null); setUnavailable(false); return }
    if (lock.current) return
    lock.current = true; setBusy(true); setError('')
    try {
      await markPart(lesson.id, 'radical')
      setFinished(true)
    } catch { setError('Could not save your progress. Please try again.') }
    finally { lock.current = false; setBusy(false) }
  }
  const status = done ? <span className="inline-flex items-center gap-1 text-tint-text"><Check aria-hidden="true" className="size-4" strokeWidth={3} />Practised</span> : `Radical ${index + 1}/${lesson.radicals.length}`
  const panel = 'glass-thick mt-4 rounded-panel p-5 shadow-lift sm:p-7'
  const answered = answer !== null
  return <div className="mx-auto w-full max-w-3xl min-w-0 pt-5 pb-12 sm:pt-7">
    <RadicalLessonHeader lesson={lesson} status={status} />
    {finished ? <motion.div initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={spring.bouncy} className="glass-thick mt-6 rounded-panel p-6 text-center shadow-lift sm:p-8">
      <span aria-hidden="true" style={{ '--tint': 'var(--pastel-yellow)' } as CSSProperties} className="glass glass-tint on-pastel mx-auto grid size-20 place-items-center rounded-full text-label"><PartyPopper className="size-10" /></span>
      <h2 className="mt-4 text-title2">Session complete</h2>
      <p className="mt-2 text-callout text-secondary-label">Your radical practice progress has been updated.</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink to="/lesson" size="lg">Continue the path</ButtonLink>
        {nextLesson && <ButtonLink to={`/radicals/${nextLesson.id}`} variant="secondary" size="lg">Next radical session</ButtonLink>}
      </div>
    </motion.div> : <>
      <div role="progressbar" aria-label="Session progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((index * STAGES.length + stageIndex) / (lesson.radicals.length * STAGES.length) * 100)} className="mt-5 h-1.5 overflow-hidden rounded-full bg-fill">
        <motion.div className="h-full rounded-full" style={{ background: 'var(--color-label)' }} initial={{ width: 0 }} animate={{ width: `${(index * STAGES.length + stageIndex) / (lesson.radicals.length * STAGES.length) * 100}%` }} transition={spring.smooth} />
      </div>
      <div className="mt-4 flex min-h-11 items-center gap-2">
        <ol aria-label="Steps" className="flex items-center gap-2">{STAGE_LABELS.map((label, i) => {
          const current = STAGES[i] === stage
          const past = i < stageIndex
          return <li key={label} aria-current={current ? 'step' : undefined} className={`grid size-8 place-items-center rounded-full text-footnote font-semibold tabular-nums transition-colors duration-300 ${current ? 'ink-pill' : past ? 'bg-feature-radicals-soft text-tint-text' : 'bg-fill text-secondary-label'}`}>
            <span className="sr-only">{label}{current ? ' (current step)' : past ? ' (done)' : ''}</span>
            <span aria-hidden="true">{past ? <Check className="size-4" strokeWidth={3} /> : i + 1}</span>
          </li>
        })}</ol>
        <p aria-hidden="true" className="ml-1 min-w-0 truncate text-subhead font-medium text-secondary-label">{STAGE_LABELS[stageIndex]}</p>
      </div>
      <motion.div key={`${index}-${stage}-info`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring.smooth} className={panel}>
        {stage === 'family' ? <RadicalMindmap key={radical.id} radical={radical} />
          : stage === 'recall' && mistakes === null ? <div><p className="text-footnote font-medium tabular-nums text-secondary-label">Radical {radical.id}/214 · write from memory</p><h2 className="mt-1 text-title2">{radical.meaning}</h2><p className="mt-2 text-subhead text-secondary-label">After writing, you will see the form and an example again.</p></div>
            : <RadicalDetails radical={radical} />}
      </motion.div>
      <motion.div key={`${index}-${stage}-task`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring.smooth, delay: 0.05 }} className={panel}>
        {stage === 'recognize' ? <>
          <h3 className="text-headline">{radicalExample(radical.id) ? <>Which radical does <span className="font-han text-xl">{radicalExample(radical.id)?.char}</span> use?</> : `Which radical means “${radical.meaning}”?`}</h3>
          <div className="mt-4 grid grid-cols-4 gap-2.5">{options.map((option) => <Button key={option.id} size="lg" aria-pressed={answer === option.id}
            variant={answered ? (option.id === radical.id ? 'good' : answer === option.id ? 'danger' : 'secondary') : 'secondary'}
            onClick={() => { if (answer !== null) return; setAnswer(option.id); cheerAnswer(option.id === radical.id) }} className={`min-h-14 font-han !text-3xl ${answered && option.id !== radical.id && answer !== option.id ? 'opacity-60' : ''}`}>{option.writingGlyph}</Button>)}</div>
          <AnimatePresence initial={false}>
            {answered && <motion.p role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={spring.smooth} className={`mt-4 flex items-start gap-2 text-subhead font-medium ${answer === radical.id ? 'text-success-text' : 'text-danger-text'}`}>
              {answer === radical.id ? <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" /> : <XCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />}
              <span>{answer === radical.id ? 'Correct.' : `The answer is ${radical.writingGlyph}. Take another look at its base and variant forms.`}</span></motion.p>}
          </AnimatePresence>
        </> : stage === 'family' ? <><ComposeQuiz key={radical.id} radical={radical} /><p className="mt-4 text-subhead text-secondary-label">Building characters is just practice and does not affect progress.</p></> : <>
          <h3 className="text-headline">{stage === 'animate' ? 'Watch each stroke' : stage === 'trace' ? 'Trace the strokes' : 'Write it from memory'}</h3>
          <div className="mt-4 flex justify-center">
            {unavailable && stage !== 'animate' ? <FreehandWriter key={`${radical.id}-${stage}`} glyph={radical.writingGlyph} showModel={stage === 'trace'} onComplete={(remembered) => setMistakes(remembered ? 0 : 4)} />
              : unavailable ? <div className="py-8 font-han text-8xl">{radical.writingGlyph}</div>
                : <StrokeWriter key={`${radical.id}-${stage}`} char={radical.writingGlyph} mode={stage} onUnavailable={() => setUnavailable(true)} onComplete={setMistakes} />}
          </div>
          {mistakes !== null && <p role="status" className="mt-4 text-center text-subhead font-medium">{mistakes === 0 ? 'All written.' : `${mistakes} stroke${mistakes === 1 ? '' : 's'} wrong or needing practice.`}</p>}
          {stage !== 'animate' && mistakes === null && <Button variant="ghost" className="mt-3" onClick={() => setMistakes(4)}>I can't write it yet, skip this step</Button>}
        </>}
        {error && <p role="alert" className="mt-3 text-subhead text-danger-text">{error}</p>}
        {(stage === 'animate' || stage === 'family' || (stage === 'recognize' && answer !== null) || (stage !== 'recognize' && mistakes !== null)) && <Button size="lg" className="mt-5 w-full sm:w-auto" disabled={busy} onClick={advance}>{busy ? 'Saving…' : lastStep ? 'Finish session' : <>Next step<ChevronRight aria-hidden="true" className="size-5" /></>}</Button>}
      </motion.div>
    </>}
  </div>
}
