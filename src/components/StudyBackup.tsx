import { useRef, useState } from 'react'
import { exportBackup, parseBackup, restoreBackup, type StudyBackup as Backup } from '@/lib/backup'
import { Button, Card } from './ui/Button'

export function StudyBackup() {
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
  return <Card className="mt-6 p-5">
    <h2 className="font-bold">Sao lưu tiến độ</h2>
    <p className="mt-2 text-sm text-muted">Tiến độ đang được lưu trên trình duyệt này. Tải bản sao để chuyển máy hoặc khôi phục sau khi xóa dữ liệu trình duyệt. Bản sao gồm thẻ, lịch ôn, buổi nhập môn và thời gian học; không gồm cài đặt giọng đọc.</p>
    <div className="mt-4 flex flex-wrap gap-3 items-start">
      <Button variant="secondary" disabled={busy} onClick={download}>Tải bản sao lưu</Button>
      <label className="text-sm font-semibold">Chọn tệp để khôi phục
        <input type="file" accept=".json,application/json" disabled={busy} className="block mt-2 w-full max-w-xs text-sm file:mr-3 file:rounded-lg file:border file:border-line file:bg-sunken file:p-2 file:text-ink" onChange={(e) => {
          const file = e.target.files?.[0]; e.target.value = ''; setPending(null)
          if (file) run(async () => { if (file.size > 20 * 1024 * 1024) throw new Error('Tệp vượt quá giới hạn 20 MB.'); setPending(parseBackup(await file.text())) })
        }} />
      </label>
    </div>
    {pending && <div className="mt-4 rounded-xl bg-gold-soft p-4">
      <p className="font-semibold">Xem trước bản sao · {new Date(pending.exportedAt).toLocaleString('vi-VN')}</p>
      <p className="mt-2 text-sm">{pending.cards.length} thẻ · {pending.reviews.length} lượt ôn · {pending.lessons.length} bài/buổi có tiến độ.</p>
      <p className="mt-2 text-sm">Khôi phục sẽ thay thế toàn bộ tiến độ hiện có trên trình duyệt này. Hãy tải bản sao hiện tại trước nếu bạn muốn giữ lại.</p>
      <div className="mt-3 flex flex-wrap gap-2"><Button disabled={busy} onClick={() => run(async () => { await restoreBackup(pending); setPending(null); setMessage('Đã khôi phục tiến độ. Bạn có thể tiếp tục học.') })}>Xác nhận thay thế và khôi phục</Button><Button variant="ghost" disabled={busy} onClick={() => setPending(null)}>Hủy</Button></div>
    </div>}
    {busy && <p role="status" className="mt-3 text-sm">Đang xử lý…</p>}
    {message && <p role="status" className="mt-3 text-sm text-jade">{message}</p>}
    {error && <p role="alert" className="mt-3 text-sm text-cinnabar">{error}</p>}
  </Card>
}
