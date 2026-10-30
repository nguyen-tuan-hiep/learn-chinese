import type { Word } from '@/data/types'
import { Pinyin } from './Pinyin'
import { SpeakButton } from './SpeakButton'
import { CharBreakdown } from './CharBreakdown'
import { ColoredHanzi, lessonHighlight } from './ColoredHanzi'
import { RadicalTags } from './RadicalTags'

/** Study card for a word: form, sound, Hán Việt, and any authored learning aids. */
export function WordCard({ word, compact = false, lessonId }: { word: Word; compact?: boolean; lessonId?: string }) {
  const highlight = lessonHighlight(lessonId)
  const han = /\p{Script=Han}/u
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        {lessonId && !compact ? <div className="flex flex-wrap" aria-label={word.hanzi}>{[...word.hanzi].map((char, i) => han.test(char) ? <ColoredHanzi key={i} char={char} highlight={highlight} size={84} /> : <span key={i} className="font-han text-6xl">{char}</span>)}</div>
          : <div className={`font-han font-semibold leading-tight break-all ${compact ? 'text-5xl' : 'text-6xl sm:text-7xl'}`}>{word.hanzi}</div>}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <Pinyin text={word.pinyin} className="text-2xl" />
            <SpeakButton text={word.hanzi} size="sm" />
            <SpeakButton text={word.hanzi} size="sm" slow />
          </div>
          <div className="mt-1.5 text-lg">
            <span className="text-sm text-muted">Hán Việt: </span><span className="font-bold tracking-wider text-gold">{word.hanViet}</span>
            <span className="text-muted"> · {word.pos}</span>
          </div>
          <div className="text-lg font-semibold">{word.meaning}</div>
          {lessonId && !compact && <RadicalTags text={word.hanzi} lessonId={lessonId} />}
        </div>
      </div>

      {!compact && word.parts && (
        <div className="mt-5 text-[15px]">
          <span className="text-muted">Cấu tạo: </span>
          <span className="font-han">{word.parts}</span>
        </div>
      )}
      {!compact && <CharBreakdown text={word.hanzi} />}
      {word.mnemonic && <p className={`leading-relaxed ${compact ? 'mt-3 text-sm text-muted' : 'mt-3 text-[15px] border-l-2 border-gold pl-3'}`}><span className="font-semibold">Mẹo nhớ: </span>{word.mnemonic}</p>}

      <ul className={`space-y-2 ${compact ? 'mt-3' : 'mt-5'}`}>
        {word.examples.map((ex) => (
          <li key={ex.hanzi} className="flex items-start gap-3">
            <SpeakButton text={ex.hanzi} size="sm" />
            <div>
              <div className="font-han text-lg">{ex.hanzi}</div>
              <div className="text-sm">
                <Pinyin text={ex.pinyin} /> <span className="text-muted">· {ex.vi}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
