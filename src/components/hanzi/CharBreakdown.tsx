import { Link } from 'react-router-dom'
import { CHAR_COMPONENTS, componentsOf } from '@/data/charComponents'
import { CHAR_NOTES, CHAR_TYPE_LABEL, NOTE_KIND_LABEL } from '@/data/charNotes'
import { RADICAL_BY_GLYPH, RADICAL_BY_ID, radicalLesson, type Radical } from '@/data/radicals'
import { RADICAL_FOR_CHARACTER } from '@/data/radicalMap'
import { charFamily, charInfo } from '@/lib/chars'
import { StrokeWriter } from './StrokeWriter'

const HAN = /\p{Script=Han}/u

const KIND_HELP: Record<string, string> = {
  'Tượng hình': 'mô phỏng hình dáng sự vật',
  'Chỉ sự': 'dùng nét để biểu thị ý',
  'Hội ý': 'ghép các phần nghĩa để tạo ý mới',
  'Hình thanh': 'một phần gợi nghĩa, một phần gợi âm',
  'Mượn nghĩa': 'mượn chữ để ghi một từ khác',
  'Giản thể': 'dạng chữ được rút gọn',
  'Hội ý / Chỉ sự': 'các phần hoặc nét kết hợp để biểu thị ý',
}

function RadicalLink({ radical, glyph }: { radical: Radical; glyph: string }) {
  return <Link className="underline underline-offset-2" to={`/radicals/${radicalLesson(radical.id)?.id}#radical-${radical.id}`}>
    <span className="font-han">{glyph}</span> · {radical.meaning}
  </Link>
}

function CharEntry({ char }: { char: string }) {
  const note = CHAR_NOTES.get(char)
  const data = CHAR_COMPONENTS.get(char)
  const parts = componentsOf(char)
  const kind = note ? NOTE_KIND_LABEL[note.kind] : data?.type && CHAR_TYPE_LABEL[data.type]
  const family = charFamily(char, 5)
  const radicalId = RADICAL_FOR_CHARACTER.get(char)
  const dictionaryRadical = radicalId === undefined ? undefined : RADICAL_BY_ID.get(radicalId)
  const role = (part: string) => part === data?.semantic ? 'nghĩa' : part === data?.phonetic ? 'âm' : ''
  return <li className="grid grid-cols-[auto_minmax(0,1fr)_72px] items-start gap-3 border-b border-line/70 py-4 last:border-b-0 sm:grid-cols-[auto_minmax(0,1fr)_88px] sm:gap-4">
    <span className="font-han mt-0.5 text-4xl leading-none text-ink">{char}</span>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        {note && <span className="text-xs font-bold tracking-wider text-gold uppercase">{note.hanViet}</span>}
      {kind && <span className="rounded-full bg-jade-soft px-2.5 py-1 text-xs font-semibold text-jade">{kind}</span>}
      </div>
      {kind && <p className="mt-1 text-xs text-muted">{KIND_HELP[kind]}</p>}
      {note && <p className="mt-1 text-sm leading-snug">{note.story}</p>}
      {parts.length > 0 && <p className="mt-1 flex flex-wrap items-center gap-x-1 text-xs text-muted"><span className="mr-1">Gồm:</span>{parts.map((part, k) => {
        const radical = RADICAL_BY_GLYPH.get(part)
        const label = role(part)
        return <span key={part + k}>{k > 0 && ' + '}{radical ? <RadicalLink radical={radical} glyph={part} /> : <span className="font-han text-base text-ink">{part}</span>}{label && <span className="ml-1">({label === 'nghĩa' ? 'gợi nghĩa' : 'gợi âm'})</span>}</span>
      })}</p>}
      {!parts.length && dictionaryRadical && <p className="mt-2 text-sm text-muted">Bộ thủ: <RadicalLink radical={dictionaryRadical} glyph={dictionaryRadical.writingGlyph} /></p>}
      {family.length > 0 && <div className="mt-2 flex flex-col items-start gap-y-1.5 text-xs text-muted">
        {family.map(({ part, chars }) => <div key={part} className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="shrink-0">Cùng <span className="font-han text-base text-ink">{part}</span>:</span>
          {chars.slice(0, 2).map((c) => {
            const info = charInfo(c)
            const example = info.words[0]?.word
            return <span key={c} className="inline-flex items-baseline gap-1 rounded-md bg-surface px-2 py-1">
              <span className="font-han text-lg leading-none text-ink">{c}</span>
              {info.pinyin && <span className="text-jade">{info.pinyin}</span>}
              {example && <span className="text-muted">{example.meaning}</span>}
            </span>
          })}
        </div>)}
      </div>}
    </div>
    <div className="flex justify-center" aria-label={`Thứ tự nét của ${char}`}>
      <StrokeWriter char={char} mode="animate" size={88} />
    </div>
  </li>
}

/** How each character of `text` is built: kind, story, parts (linked to radicals) and related characters. */
export function CharBreakdown({ text, collapsible = false }: { text: string; collapsible?: boolean }) {
  const chars = [...new Set([...text])].filter((char) => HAN.test(char))
  if (!chars.length) return null
  const entries = <ul className="divide-y divide-line/70">{chars.map((char) => <CharEntry key={char} char={char} />)}</ul>
  if (collapsible) return <details className="mt-5 rounded-xl border border-line bg-sunken">
    <summary className="flex min-h-12 cursor-pointer list-none flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl px-4 py-3 hover:bg-surface [&::-webkit-details-marker]:hidden">
      <span className="font-semibold">Cấu tạo chữ</span>
      <span className="text-xs text-muted">Xem thành phần và chữ cùng họ</span>
    </summary>
    <div className="border-t border-line p-3 text-sm">{entries}</div>
  </details>
  return <div className="mt-4 rounded-xl border border-line bg-sunken p-3 text-sm">
    <p className="mb-2 font-semibold">Cấu tạo chữ</p>
    {entries}
  </div>
}
