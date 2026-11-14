import { useId, useRef, useState } from 'react'
import { exportBackup, parseBackup, restoreBackup, type StudyBackup as Backup } from '@/lib/backup'
import { Download, Upload } from 'lucide-react'
import { Button } from './ui/Button'
import { ListRow } from './ui/ListGroup'
import { IconBadge } from './settings/IconBadge'
import { SettingsSection } from './settings/SettingsSection'

/** Settings section "Sao lưu": export and import the study progress as a JSON file (logic unchanged). */
export function StudyBackup() {
  const inputId = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [pending, setPending] = useState<Backup | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const lock = useRef(false)
  const run = async (action: () => Promise<void>) => {
    if (lock.current) return
    lock.current = true; setBusy(true); setError(''); setMessage('')
    try { await action() } catch (e) { setError(e instanceof Error ? e.message : 'Không thể xử lý tệp sao lưu. Hãy thử lại.') }
    finally { lock.current = false; setBusy(false) }
  }
  const download = () => run(async () => {
    const backup = await exportBackup()
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = `learn-chinese-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Đã tạo tệp sao lưu. Hãy giữ tệp ở nơi bạn dễ tìm lại.')
  })
  return <SettingsSection title="Sao lưu" aria-busy={busy}
    footer="Tiến độ được lưu trên trình duyệt này. Bản sao giúp bạn chuyển máy hoặc khôi phục sau khi xóa dữ liệu trình duyệt, gồm tiến độ bài học, thời gian học và dữ liệu ôn tập cũ nếu có; không gồm cài đặt giọng đọc.">
    <ListRow leading={<IconBadge color="var(--color-success)"><Download /></IconBadge>} title="Tải bản sao về máy" subtitle="Tệp JSON, lưu ở nơi bạn dễ tìm lại"
      trailing={<Button variant="tinted" size="sm" disabled={busy} onClick={download}>Tải về</Button>} />
    <ListRow leading={<IconBadge color="var(--color-tint)"><Upload /></IconBadge>} title="Khôi phục từ tệp" subtitle={<span title={fileName || undefined}>{fileName || 'Tệp .json, tối đa 20 MB'}</span>}
      trailing={<>
        <label htmlFor={inputId} className="sr-only">Chọn tệp để khôi phục</label>
        <input id={inputId} ref={fileInput} type="file" accept=".json,application/json" disabled={busy} className="sr-only" tabIndex={-1} onChange={(e) => {
          const file = e.target.files?.[0]; e.target.value = ''; setPending(null)
          if (file) {
            setFileName(file.name)
            void run(async () => { if (file.size > 20 * 1024 * 1024) throw new Error('Tệp vượt quá giới hạn 20 MB.'); setPending(parseBackup(await file.text())) })
          }
        }} />
        <Button variant="tinted" size="sm" disabled={busy} onClick={() => fileInput.current?.click()}>Chọn tệp</Button>
      </>} />
    {pending && <section aria-labelledby="backup-preview-title" className="min-w-0 bg-warning-soft px-4 py-4">
      <h3 id="backup-preview-title" className="text-subhead font-semibold">Xem trước bản sao</h3>
      <p className="mt-1 text-footnote text-secondary-label">Được tạo lúc {new Date(pending.exportedAt).toLocaleString('vi-VN')}</p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-subhead">{[[pending.cards.length, 'Thẻ'], [pending.reviews.length, 'Lượt ôn'], [pending.lessons.length, 'Bài có tiến độ']].map(([count, label]) => <div key={label} className="min-w-0"><dt className="text-footnote text-secondary-label">{label}</dt><dd className="mt-1 font-semibold tabular-nums">{count}</dd></div>)}</dl>
      <p className="mt-3 text-subhead leading-relaxed">Khôi phục sẽ thay thế toàn bộ tiến độ hiện có trên trình duyệt này. Hãy tải bản sao hiện tại trước nếu bạn muốn giữ lại.</p>
      <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap"><Button className="w-full sm:w-auto" disabled={busy} onClick={() => run(async () => { await restoreBackup(pending); setPending(null); setMessage('Đã khôi phục tiến độ. Bạn có thể tiếp tục học.') })}>Xác nhận thay thế và khôi phục</Button><Button className="w-full sm:w-auto" variant="ghost" disabled={busy} onClick={() => setPending(null)}>Hủy</Button></div>
    </section>}
    {(busy || message || error) && <div className="min-w-0 px-4 py-3">
      {busy && <p role="status" className="text-subhead">Đang xử lý…</p>}
      {message && <p role="status" className="break-words text-subhead text-success-text">{message}</p>}
      {error && <p role="alert" className="break-words text-subhead text-danger-text">{error}</p>}
    </div>}
  </SettingsSection>
}
