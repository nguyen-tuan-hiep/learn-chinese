import { db } from './db'
import { useSettings } from '@/store/settings'

/** Finish a settings handoff left by a completed restore, including after a tab close or browser crash. */
export async function recoverPendingRestoreSettings() {
  const pending = await db.restoreJournal.get('srs-settings')
  if (!pending) return
  useSettings.getState().set({ ...pending.settings, fsrsWeights: [...pending.settings.fsrsWeights] })
  await db.restoreJournal.delete('srs-settings')
}
