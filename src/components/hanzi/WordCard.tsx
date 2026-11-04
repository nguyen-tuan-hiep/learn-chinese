import type { Word } from '@/data/types'
import { Disclosure } from '@/components/ui/Disclosure'
import { Badge } from '@/components/ui/Badge'
import { Pinyin } from './Pinyin'
import { SpeakButton } from './SpeakButton'
import { CharBreakdown } from './CharBreakdown'
import { ColoredHanzi, lessonHighlight } from './ColoredHanzi'
import { RadicalTags } from './RadicalTags'

/** Study card for a word: form, sound, Hán Việt, and any authored learning aids. */
export function WordCard({ word, compact = false, lessonId }: { word: Word; compact?: boolean; lessonId?: string }) {
  const highlight = lessonHighlight(lessonId)
  const han = /\p{Script=Han}/u
  const chars = [...word.hanzi]
  const glyphSize = chars.length > 3 ? 64 : chars.length > 1 ? 84 : 120
  if (compact) return <div className="w-full">
    <div className="font-han text-5xl leading-tight break-all">{word.hanzi}</div>
    <div className="mt-2 flex flex-wrap items-center gap-2"><Pinyin text={word.pinyin} className="text-2xl" /><SpeakButton text={word.hanzi} size="sm" /></div>
    <div className="mt-1 text-lg"><span className="font-bold tracking-wider text-gold">{word.hanViet}</span><span className="text-muted"> · {word.pos}</span></div>
    <div className="text-lg font-semibold">{word.meaning}</div>
    {word.mnemonic && <p className="mt-3 text-sm text-muted"><span className="font-semibold">Mẹo nhớ: </span>{word.mnemonic}</p>}
    <ul className="mt-3 space-y-2">{word.examples.map((ex) => <li key={ex.hanzi} className="flex items-start gap-3">
      <SpeakButton text={ex.hanzi} size="sm" />
      <div><div className="font-han text-lg">{ex.hanzi}</div><div className="text-sm"><Pinyin text={ex.pinyin} /> <span className="text-muted">· {ex.vi}</span></div></div>
    </li>)}</ul>
  </div>

  return (
    <div className="w-full space-y-6">
      <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
        <div lang="zh-CN" aria-label={word.hanzi} className="flex h-44 min-w-44 flex-wrap content-center items-center justify-center justify-self-center rounded-2xl bg-sunken px-5 sm:justify-self-start">
          {lessonId ? chars.map((char, i) => han.test(char) ? <ColoredHanzi key={i} char={char} highlight={highlight} size={glyphSize} /> : <span key={i} className="font-han text-6xl">{char}</span>)
            : <span className="font-han text-7xl">{word.hanzi}</span>}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Pinyin text={word.pinyin} className="text-3xl font-semibold" />
            <SpeakButton text={word.hanzi} size="sm" />
            <SpeakButton text={word.hanzi} size="sm" slow />
          </div>
          <p className="mt-2 text-xl font-semibold leading-snug text-balance">{word.meaning}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {word.hanViet && <Badge tone="gold">Hán Việt · {word.hanViet}</Badge>}
            {word.pos && <Badge>{word.pos}</Badge>}
          </div>
          {lessonId && <RadicalTags text={word.hanzi} lessonId={lessonId} />}
        </div>
      </div>

      {word.examples.length > 0 && <ul className="divide-y divide-line rounded-xl border border-line">
        {word.examples.map((ex) => (
          <li key={ex.hanzi} className="flex items-start gap-3 p-3 sm:p-4">
            <SpeakButton text={ex.hanzi} size="sm" />
            <div className="min-w-0">
              <div lang="zh-CN" className="font-han text-xl">{ex.hanzi}</div>
              <div className="text-sm"><Pinyin text={ex.pinyin} /> <span className="text-muted">· {ex.vi}</span></div>
            </div>
          </li>
        ))}
      </ul>}

      {word.mnemonic && <p className="rounded-xl bg-gold-soft/70 px-4 py-3 leading-relaxed"><span className="font-semibold">Mẹo nhớ: </span>{word.mnemonic}</p>}

      <Disclosure className="border-t border-line pt-2"
        summary={<span className="font-semibold">Cấu tạo chữ {word.parts && <span className="font-han font-normal text-muted">· {word.parts}</span>}</span>}>
        <CharBreakdown text={word.hanzi} />
      </Disclosure>
    </div>
  )
}
