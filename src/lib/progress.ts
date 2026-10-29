export function dateKey(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/** Consecutive study days (≥1 minute) ending today, or yesterday if today has no study yet. */
export function streakFrom(days: { date: string; seconds: number }[], today = new Date()): number {
  const studied = new Set(days.filter((d) => d.seconds >= 60).map((d) => d.date))
  const cursor = new Date(today)
  if (!studied.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let n = 0
  while (studied.has(dateKey(cursor))) {
    n++
    cursor.setDate(cursor.getDate() - 1)
  }
  return n
}
