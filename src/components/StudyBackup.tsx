import { useId, useRef, useState } from 'react'
import { exportBackup, parseBackup, restoreBackup, type StudyBackup as Backup } from '@/lib/backup'
import { Download, TriangleAlert, Upload } from 'lucide-react'
import { Button } from './ui/Button'
import { ListRow } from './ui/ListGroup'
import { IconBadge } from './settings/IconBadge'
import { SettingsSection } from './settings/SettingsSection'

/** Settings section "Backup": export and import the study progress as a JSON file (logic unchanged). */
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
    try { await action() } catch (e) { setError(e instanceof Error ? e.message : 'Could not process the backup file. Please try again.') }
    finally { lock.current = false; setBusy(false) }
  }
  const download = () => run(async () => {
    const backup = await exportBackup()
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = `learn-chinese-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Backup file created. Keep it somewhere easy to find.')
  })
  return <SettingsSection title="Backup" aria-busy={busy}
    footer="Your progress is stored in this browser. A backup includes lesson progress, study time, review history and spaced-repetition settings, but not voice or appearance settings.">
    <ListRow leading={<IconBadge color="var(--color-tint)"><Download /></IconBadge>} title="Download a backup" subtitle="A JSON file, keep it somewhere easy to find"
      trailing={<Button variant="fill" size="sm" disabled={busy} onClick={download}>Download</Button>} />
    <ListRow leading={<IconBadge color="var(--color-tint)"><Upload /></IconBadge>} title="Restore from file" subtitle={<span title={fileName || undefined}>{fileName || '.json file, up to 20 MB'}</span>}
      trailing={<>
        <label htmlFor={inputId} className="sr-only">Choose a file to restore</label>
        <input id={inputId} ref={fileInput} type="file" accept=".json,application/json" disabled={busy} className="sr-only" tabIndex={-1} onChange={(e) => {
          const file = e.target.files?.[0]; e.target.value = ''; setPending(null)
          if (file) {
            setFileName(file.name)
            void run(async () => { if (file.size > 20 * 1024 * 1024) throw new Error('The file is larger than 20 MB.'); setPending(parseBackup(await file.text())) })
          }
        }} />
        <Button variant="fill" size="sm" disabled={busy} onClick={() => fileInput.current?.click()}>Choose file</Button>
      </>} />
    {pending && <section aria-labelledby="backup-preview-title" className="min-w-0 px-4 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="backup-preview-title" className="text-subhead font-semibold">Backup preview</h3>
        <p className="min-w-0 truncate text-footnote text-secondary-label">{new Date(pending.exportedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        {[[pending.cards.length, 'Cards'], [pending.reviews.length, 'Reviews'], [pending.lessons.length, 'Lessons']].map(([count, label]) => <div key={label} className="min-w-0 rounded-2xl bg-fill px-3 py-2.5">
          <dd className="text-title3 font-semibold tabular-nums">{count}</dd>
          <dt className="truncate text-footnote text-secondary-label">{label}</dt>
        </div>)}
      </dl>
      <p className="mt-2 px-1 text-footnote text-secondary-label">{pending.srsSettings ? `${pending.srsSettings.fsrsModel} · ${pending.srsSettings.fsrsWeights.length} parameters · ${Math.round(pending.srsSettings.desiredRetention * 100)}% retention` : 'Legacy backup · current FSRS settings will be kept'}</p>
      <div role="note" className="mt-3 flex items-start gap-3 px-1">
        <IconBadge color="var(--color-warning)"><TriangleAlert /></IconBadge>
        <p className="min-w-0 flex-1 text-footnote leading-relaxed text-secondary-label">Restoring replaces all progress in this browser. Download a backup of it first if you want to keep it.</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="fill" disabled={busy} onClick={() => setPending(null)}>Cancel</Button>
        <Button variant="danger" disabled={busy} onClick={() => run(async () => { await restoreBackup(pending); setPending(null); setMessage('Progress and scheduling settings restored. You can carry on studying.') })}>Replace and restore</Button>
      </div>
    </section>}
    {(busy || message || error) && <div className="min-w-0 px-4 py-3">
      {busy && <p role="status" className="text-subhead">Working…</p>}
      {message && <p role="status" className="break-words text-subhead text-success-text">{message}</p>}
      {error && <p role="alert" className="break-words text-subhead text-danger-text">{error}</p>}
    </div>}
  </SettingsSection>
}
