import { Link } from 'react-router-dom'
import { CHAR_COMPONENTS, componentsOf } from '@/data/charComponents'
import { CHAR_NOTES, CHAR_TYPE_LABEL, NOTE_KIND_LABEL } from '@/data/charNotes'
import { RADICAL_BY_GLYPH, RADICAL_BY_ID, radicalLesson, type Radical } from '@/data/radicals'
import { RADICAL_FOR_CHARACTER } from '@/data/radicalMap'
import { charFamily, charInfo } from '@/lib/chars'

const HAN = /\p{Script=Han}/u

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
  return <li className="flex gap-3">
    <span className="font-han text-3xl leading-none">{char}</span>
    <div className="min-w-0 flex-1">
      <p>
        {kind && <span className="mr-2 rounded-md bg-surface px-1.5 py-0.5 text-xs font-semibold">{kind}</span>}
        {note && <span className="font-bold tracking-wider text-gold uppercase">{note.hanViet}</span>}
      </p>
      {note && <p className="mt-1 leading-relaxed">{note.story}</p>}
      {parts.length > 0 && <p className="mt-1 text-muted">Thành phần: {parts.map((part, k) => {
        const radical = RADICAL_BY_GLYPH.get(part)
        const label = role(part)
        return <span key={part + k}>{k > 0 && ' + '}{radical ? <RadicalLink radical={radical} glyph={part} /> : <span className="font-han text-ink">{part}</span>}{label && ` (gợi ${label})`}</span>
      })}</p>}
      {!parts.length && dictionaryRadical && <p className="mt-1 text-muted">Bộ thủ: <RadicalLink radical={dictionaryRadical} glyph={dictionaryRadical.writingGlyph} /></p>}
      {family.length > 0 && <p className="mt-1 text-muted">Cùng họ: {family.map(({ part, chars }) => <span key={part} className="mr-3 inline-block">
        <span className="font-han text-ink">{part}</span> → {chars.map((c) => <span key={c} className="font-han text-ink mr-1" title={charInfo(c).words[0]?.word.meaning}>{c}</span>)}
      </span>)}</p>}
    </div>
  </li>
}

/** How each character of `text` is built: kind, story, parts (linked to radicals) and related characters. */
export function CharBreakdown({ text }: { text: string }) {
  const chars = [...new Set([...text])].filter((char) => HAN.test(char))
  if (!chars.length) return null
  return <div className="mt-4 rounded-xl border border-line bg-sunken p-3 text-sm">
    <p className="font-semibold mb-2">Nhìn chữ qua cấu tạo</p>
    <ul className="space-y-3">{chars.map((char) => <CharEntry key={char} char={char} />)}</ul>
  </div>
}
