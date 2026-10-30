import { useId, useRef, useState } from 'react'
import { exportBackup, parseBackup, restoreBackup, type StudyBackup as Backup } from '@/lib/backup'
import { Button, Card } from './ui/Button'

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
    const a = document.createElement('a'); a.href = url; a.download = `hanyu-path-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Đã tạo tệp sao lưu. Hãy giữ tệp ở nơi bạn dễ tìm lại.')
  })
  return <Card className="mt-6 min-w-0 p-4 sm:p-5" aria-labelledby="study-backup-title" aria-busy={busy}>
    <h2 id="study-backup-title" className="font-semibold">Sao lưu tiến độ</h2>
    <p className="mt-2 text-sm leading-relaxed text-muted">Tiến độ được lưu trên trình duyệt này. Bản sao giúp bạn chuyển máy hoặc khôi phục sau khi xóa dữ liệu trình duyệt, gồm tiến độ bài học, thời gian học và dữ liệu ôn tập cũ nếu có; không gồm cài đặt giọng đọc.</p>
    <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
      <section aria-labelledby="backup-download-title" className="flex min-w-0 flex-col rounded-xl border border-line bg-paper/50 p-4">
        <h3 id="backup-download-title" className="text-sm font-semibold">Tải bản sao về máy</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">Lưu tiến độ hiện tại thành tệp để dùng lại khi cần.</p>
        <div className="mt-auto pt-4">
          <Button variant="secondary" className="min-h-11 w-full sm:w-auto" disabled={busy} onClick={download}>Tải bản sao lưu</Button>
          <p className="mt-2 min-h-5 text-xs text-muted">Định dạng JSON · lưu ở nơi bạn dễ tìm lại.</p>
        </div>
      </section>
      <section aria-labelledby="backup-restore-title" className="flex min-w-0 flex-col rounded-xl border border-line bg-paper/50 p-4">
        <h3 id="backup-restore-title" className="text-sm font-semibold">Khôi phục từ tệp</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">Chọn bản sao để xem trước trước khi xác nhận khôi phục.</p>
        <div className="mt-auto min-w-0 pt-4">
          <label htmlFor={inputId} className="sr-only">Chọn tệp để khôi phục</label>
          <input id={inputId} ref={fileInput} type="file" accept=".json,application/json" disabled={busy} className="sr-only" tabIndex={-1} onChange={(e) => {
            const file = e.target.files?.[0]; e.target.value = ''; setPending(null)
            if (file) {
              setFileName(file.name)
              void run(async () => { if (file.size > 20 * 1024 * 1024) throw new Error('Tệp vượt quá giới hạn 20 MB.'); setPending(parseBackup(await file.text())) })
            }
          }} />
          <Button variant="secondary" className="min-h-11 w-full sm:w-auto" disabled={busy} onClick={() => fileInput.current?.click()}>Chọn tệp sao lưu</Button>
          <p className="mt-2 min-h-5 truncate text-xs text-muted" title={fileName || undefined}>{fileName || 'Tệp .json · tối đa 20 MB.'}</p>
        </div>
      </section>
    </div>
    {pending && <section aria-labelledby="backup-preview-title" className="mt-4 min-w-0 rounded-xl bg-gold-soft p-4">
      <h3 id="backup-preview-title" className="text-sm font-semibold">Xem trước bản sao</h3>
      <p className="mt-1 text-xs text-muted">Được tạo lúc {new Date(pending.exportedAt).toLocaleString('vi-VN')}</p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">{[[pending.cards.length, 'Thẻ'], [pending.reviews.length, 'Lượt ôn'], [pending.lessons.length, 'Bài có tiến độ']].map(([count, label]) => <div key={label} className="min-w-0"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 font-semibold tabular-nums">{count}</dd></div>)}</dl>
      <p className="mt-3 text-sm leading-relaxed">Khôi phục sẽ thay thế toàn bộ tiến độ hiện có trên trình duyệt này. Hãy tải bản sao hiện tại trước nếu bạn muốn giữ lại.</p>
      <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap"><Button className="min-h-11 w-full sm:w-auto" disabled={busy} onClick={() => run(async () => { await restoreBackup(pending); setPending(null); setMessage('Đã khôi phục tiến độ. Bạn có thể tiếp tục học.') })}>Xác nhận thay thế và khôi phục</Button><Button className="min-h-11 w-full sm:w-auto" variant="ghost" disabled={busy} onClick={() => setPending(null)}>Hủy</Button></div>
    </section>}
    {busy && <p role="status" className="mt-3 text-sm">Đang xử lý…</p>}
    {message && <p role="status" className="mt-3 break-words text-sm text-jade">{message}</p>}
    {error && <p role="alert" className="mt-3 break-words text-sm text-cinnabar">{error}</p>}
  </Card>
}
