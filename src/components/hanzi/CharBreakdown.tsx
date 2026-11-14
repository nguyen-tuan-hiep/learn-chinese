import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
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
  return <Link className="inline-flex items-baseline gap-1 rounded-full bg-warning-soft px-2.5 py-0.5 text-footnote font-medium text-warning-text" to={`/radicals/${radicalLesson(radical.id)?.id}#radical-${radical.id}`}>
    <span className="font-han text-base">{glyph}</span> {radical.meaning}
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
  return <li className="grid grid-cols-[auto_minmax(0,1fr)_72px] items-start gap-3 py-4 first:pt-1 last:pb-1 sm:grid-cols-[auto_minmax(0,1fr)_88px] sm:gap-4">
    <span lang="zh-CN" className="font-han mt-0.5 text-4xl leading-none text-label">{char}</span>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        {note && <span className="text-footnote font-semibold text-warning-text">{note.hanViet}</span>}
        {kind && <span className="rounded-full bg-tint-soft px-2.5 py-0.5 text-caption font-semibold text-tint-text">{kind}</span>}
      </div>
      {kind && <p className="mt-1 text-footnote text-secondary-label">{KIND_HELP[kind]}</p>}
      {note && <p className="mt-1.5 text-subhead leading-snug text-label">{note.story}</p>}
      {parts.length > 0 && <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1.5 text-footnote text-secondary-label"><span>Gồm</span>{parts.map((part, k) => {
        const radical = RADICAL_BY_GLYPH.get(part)
        const label = role(part)
        return <span key={part + k} className="inline-flex items-center gap-1.5">{k > 0 && <span aria-hidden="true">+</span>}{radical ? <RadicalLink radical={radical} glyph={part} /> : <span lang="zh-CN" className="rounded-full bg-fill px-2.5 py-0.5 font-han text-base text-label">{part}</span>}{label && <span>({label === 'nghĩa' ? 'gợi nghĩa' : 'gợi âm'})</span>}</span>
      })}</p>}
      {!parts.length && dictionaryRadical && <p className="mt-2 flex flex-wrap items-center gap-1.5 text-footnote text-secondary-label">Bộ thủ <RadicalLink radical={dictionaryRadical} glyph={dictionaryRadical.writingGlyph} /></p>}
      {family.length > 0 && <div className="mt-2.5 flex flex-col items-start gap-y-2 text-footnote text-secondary-label">
        {family.map(({ part, chars }) => <div key={part} className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="shrink-0">Cùng <span lang="zh-CN" className="font-han text-base text-label">{part}</span></span>
          {chars.slice(0, 2).map((c) => {
            const info = charInfo(c)
            const example = info.words[0]?.word
            return <span key={c} className="inline-flex items-baseline gap-1.5 rounded-full bg-fill px-3 py-1">
              <span lang="zh-CN" className="font-han text-lg leading-none text-label">{c}</span>
              {info.pinyin && <span className="text-tint-text">{info.pinyin}</span>}
              {example && <span>{example.meaning}</span>}
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
  const entries = <ul className="divide-y divide-separator">{chars.map((char) => <CharEntry key={char} char={char} />)}</ul>
  if (collapsible) return <details className="group mt-5 rounded-2xl bg-fill/60">
    <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 [&::-webkit-details-marker]:hidden">
      <span className="min-w-0 flex-1">
        <span className="block text-headline">Cấu tạo chữ</span>
        <span className="block text-footnote text-secondary-label">Xem thành phần và chữ cùng họ</span>
      </span>
      <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-secondary-label transition-transform duration-200 group-open:rotate-180" />
    </summary>
    <div className="mx-4 border-t border-separator pb-3 pt-3 text-subhead">{entries}</div>
  </details>
  return <div className="mt-4 rounded-2xl bg-fill/60 p-4 text-subhead">
    <p className="mb-3 text-headline">Cấu tạo chữ</p>
    {entries}
  </div>
}
