import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SOUND_GUIDE, SOUND_GROUPS, TONE_GUIDE, type SoundKind } from '@/data/pronunciationGuide'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { ToneContour } from '@/components/hanzi/ToneContour'

export function PronunciationChart({ kind, searchable = false }: { kind?: SoundKind | 'tones'; searchable?: boolean }) {
  const [filter, setFilter] = useState<SoundKind | 'tones' | 'all'>(kind ?? 'all')
  const [query, setQuery] = useState('')
  const active = searchable ? filter : kind ?? 'all'
  const normalized = query.toLocaleLowerCase().normalize('NFD').replace(/u\u0308/g, 'ü').replace(/[\u0300-\u036f]/g, '').replace(/v/g, 'ü')
  const match = (value: string) => value.toLocaleLowerCase().normalize('NFD').replace(/u\u0308/g, 'ü').replace(/[\u0300-\u036f]/g, '').includes(normalized)
  const sounds = SOUND_GUIDE.filter(s => (active === 'all' || active === s.kind) && (!query || match(`${s.label} ${s.pinyin} ${s.approximate}`)))
  const tones = (active === 'all' || active === 'tones') ? TONE_GUIDE.filter(t => !query || match(`${t.label} ${t.pinyin}`)) : []
  return <div className="mt-4 min-w-0 space-y-4">
    <p className="rounded-xl bg-gold-soft px-4 py-3 text-sm leading-relaxed">Gợi âm tiếng Việt chỉ gần đúng. Hãy nghe âm tiết mẫu và điều chỉnh khẩu hình; không đọc pinyin hoàn toàn theo tiếng Việt. Nút nghe dùng giọng tiếng Trung trên thiết bị. <Link to="/stats#settings" className="underline">Kiểm tra giọng đọc</Link> nếu chưa nghe được.</p>
    {searchable && <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-medium">Tìm âm pinyin<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ví dụ: ü, zh, ang…" className="mt-1 block min-h-11 w-full rounded-xl border border-line bg-surface px-3 font-normal" /></label>
      <label className="text-sm font-medium">Nhóm âm<select value={filter} onChange={e => setFilter(e.target.value as typeof filter)} className="mt-1 block min-h-11 w-full rounded-xl border border-line bg-surface px-3 font-normal"><option value="all">Tất cả</option><option value="initials">Thanh mẫu</option><option value="finals">Vận mẫu</option><option value="tones">Thanh điệu</option></select></label>
    </div>}
    {tones.length > 0 && <section aria-label="Bảng thanh điệu" className="space-y-2"><h3 className="font-semibold">Thanh điệu · nghe cả cao độ và độ dài</h3>{tones.map(t => <div key={t.tone} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3 sm:p-4">
      {t.tone !== 5 && <div className="hidden sm:block"><ToneContour tone={t.tone} size={48} animate={false} /></div>}
      <div className="min-w-0 flex-1"><p className="font-medium">{t.label} <span className="ml-2 text-muted">{t.mark}</span></p><p className="mt-1 text-sm">{t.direction}</p><p className="mt-1 text-sm text-muted">{t.caution}</p><p className="mt-2 text-lg">{t.pinyin} <span lang="zh-CN" className="font-han">{t.say}</span></p></div><SpeakButton text={t.say} />
    </div>)}</section>}
    {SOUND_GROUPS.map(group => {
      const rows = sounds.filter(s => s.group === group.id)
      if (!rows.length) return null
      return <details key={`${group.id}-${query}-${active}`} open={searchable || group.id === 'initials-1' || group.id === 'vowels'} className="min-w-0 rounded-xl border border-line p-3">
        <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">{group.title} <span className="font-normal text-muted">· {rows.length} âm</span></summary>
        <table className="block w-full table-fixed text-left text-sm sm:table">
          <caption className="sr-only">{group.title}: gợi âm, khẩu hình và âm mẫu</caption>
          <thead className="hidden bg-sunken sm:table-header-group"><tr>{['Pinyin', 'Gợi âm tiếng Việt', 'Khẩu hình và chú ý', 'Nghe mẫu'].map((heading, i) => <th key={heading} scope="col" className={`p-3 font-medium ${i === 0 ? 'w-[12%]' : i === 1 ? 'w-[23%]' : i === 3 ? 'w-[20%]' : ''}`}>{heading}</th>)}</tr></thead>
          <tbody className="grid gap-2 sm:table-row-group">{rows.map(s => <tr key={s.id} className="grid grid-cols-[4rem_minmax(0,1fr)] rounded-xl border border-line bg-surface p-3 sm:table-row sm:p-0">
            <th scope="row" className="text-xl font-medium sm:p-3 sm:align-top">{s.label}</th>
            <td className="min-w-0 sm:p-3 sm:align-top"><span className="block text-xs text-muted sm:hidden">Gợi âm tiếng Việt</span>{s.approximate}</td>
            <td className="col-span-2 mt-3 sm:mt-0 sm:p-3 sm:align-top"><p>{s.mouth}</p><p className="mt-1 text-muted">{s.caution}</p></td>
            <td className="col-span-2 mt-3 sm:mt-0 sm:p-3 sm:align-top"><div className="flex items-center gap-2"><SpeakButton text={s.say} /><span>{s.pinyin}<span lang="zh-CN" className="font-han ml-1">{s.say}</span></span></div></td>
          </tr>)}</tbody>
        </table>
      </details>
    })}
    {!sounds.length && !tones.length && <p role="status" className="text-sm text-muted">Không tìm thấy âm phù hợp. Thử pinyin khác hoặc chọn Tất cả.</p>}
    {active !== 'tones' && <p className="text-sm text-muted">Quy ước: y/w dùng để viết âm tiết bắt đầu bằng i/u/ü (yi, wu, yu…), không cộng thêm vào 21 thanh mẫu ở bảng trên. Các dạng iu/ui/un lần lượt viết gọn từ iou/uei/uen sau thanh mẫu; ü bỏ hai chấm sau j/q/x/y.</p>}
  </div>
}
