import { Link } from 'react-router-dom'
import { RADICAL_BY_ID, radicalLesson } from '@/data/radicals'
import { RADICAL_FOR_CHARACTER } from '@/data/radicalMap'

/** A dictionary radical is one classifier, not a full decomposition. */
export function RadicalNote({ text }: { text: string }) {
  const entries = [...new Set([...text])].flatMap((char) => {
    const id = RADICAL_FOR_CHARACTER.get(char)
    const radical = id === undefined ? undefined : RADICAL_BY_ID.get(id)
    return radical ? [{ char, radical }] : []
  })
  if (!entries.length) return null
  return <div className="mt-4 rounded-xl border border-line bg-sunken p-3 text-sm">
    <p className="font-semibold mb-1.5">Nhìn chữ qua bộ thủ</p>
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {entries.map(({ char, radical }) => <span key={char}>
        <span className="font-han text-lg">{char}</span> → <Link className="underline underline-offset-2" to={`/radicals/${radicalLesson(radical.id)?.id}#radical-${radical.id}`}>
          <span className="font-han">{radical.glyph}</span> · {radical.meaning}
        </Link>
      </span>)}
    </div>
    <p className="text-muted mt-1">Bộ thủ giúp phân loại chữ; chữ có thể còn các thành phần khác.</p>
  </div>
}
