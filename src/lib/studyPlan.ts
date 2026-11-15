import { db, type PlanDay, type PlanWeek } from './db'
import { dateKey } from './progress'

export const PLAN_WEEKS = 26
export const DAILY_BLOCKS = [
  { id: 'review', label: 'Review due cards', minutes: 10 },
  { id: 'lesson', label: 'HSK lesson or introduction', minutes: 20 },
  { id: 'radical', label: 'Radicals or handwriting', minutes: 10 },
  { id: 'shadow', label: 'Listen and shadow', minutes: 10 },
  { id: 'speaking', label: 'Speak and record yourself', minutes: 5 },
] as const

function utcDay(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

/** Calendar weeks since activation; 27 means the six-month plan has ended. */
export function planWeek(startDate: string, today = dateKey()) {
  return Math.max(1, Math.floor((utcDay(today) - utcDay(startDate)) / (7 * 86_400_000)) + 1)
}

export function weekGuide(week: number) {
  if (week <= 2) return { phase: 'Getting started', focus: 'Learn the tones, initials, finals and pinyin spelling on the Pronunciation page; use them right away in HSK 1.', hsk: 'HSK 1 · lessons 1–2', radicals: 'Learn character structure and radicals inside each HSK lesson; no need to study the radical list first.' }
  if (week <= 10) {
    const first = (week - 3) * 2 + 1
    return { phase: 'HSK 1', focus: 'Learn words in sentences, read aloud and record a short self-introduction each week.', hsk: `HSK 1 · lessons ${first}${first < 15 ? `–${first + 1}` : ''}`, radicals: 'The Characters & radicals part at the start of each lesson: about 5 radicals per lesson.' }
  }
  if (week <= 18) {
    const first = (week - 11) * 2 + 1
    return { phase: 'HSK 2', focus: 'Practise answering in full sentences about daily life; review the HSK 2.0 word list.', hsk: `HSK 2 · lessons ${first}${first < 15 ? `–${first + 1}` : ''}`, radicals: 'The Characters & radicals part of each lesson; look up new radicals in the dictionary.' }
  }
  if (week <= 22) return { phase: 'HSK 3–6', focus: 'Keep learning vocabulary by level, practise listening and reading, and review weak word groups.', hsk: 'HSK 2.0 vocabulary', radicals: 'Recognise rare radicals; write common characters.' }
  return { phase: 'Review', focus: 'Take a timed HSK practice test each week; drill your mistakes and record 3–5 minutes of speech.', hsk: 'HSK practice tests', radicals: 'Review the characters you often get wrong.' }
}

export async function startStudyPlan() {
  const existing = await db.studyPlans.get('main')
  if (existing) return existing
  const plan = { id: 'main' as const, startDate: dateKey() }
  await db.studyPlans.add(plan)
  return plan
}

export async function setPlanDay(date: string, field: 'shadowDone' | 'speakingDone', value: boolean) {
  await db.transaction('rw', db.planDays, async () => {
    const old = await db.planDays.get(date)
    await db.planDays.put({ date, ...old, [field]: value } as PlanDay)
  })
}

export async function savePlanWeek(week: number, patch: Omit<PlanWeek, 'week'>) {
  await db.planWeeks.put({ week, ...patch })
}
