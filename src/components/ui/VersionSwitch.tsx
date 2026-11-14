import { useSettings } from '@/store/settings'
import { Segmented } from './Segmented'

/** "HSK 2.0 | HSK 3.0" switch bound to the hskVersion setting. */
export function VersionSwitch({ className = '' }: { className?: string }) {
  const version = useSettings((s) => s.hskVersion)
  const set = useSettings((s) => s.set)
  return <Segmented label="Phiên bản HSK" className={className} value={version} onChange={(hskVersion) => set({ hskVersion })}
    options={[{ value: '2.0', label: 'HSK 2.0' }, { value: '3.0', label: 'HSK 3.0' }]} />
}
