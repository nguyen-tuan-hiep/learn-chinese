import { db, type PlanDay, type PlanWeek } from './db'
import { dateKey } from './progress'

export const PLAN_WEEKS = 26
export const DAILY_BLOCKS = [
  { id: 'review', label: 'Ôn thẻ đến hạn', minutes: 10 },
  { id: 'lesson', label: 'Bài HSK hoặc nhập môn', minutes: 20 },
  { id: 'radical', label: 'Bộ thủ hoặc viết chữ', minutes: 10 },
  { id: 'shadow', label: 'Nghe và nói theo', minutes: 10 },
  { id: 'speaking', label: 'Tự nói và ghi âm', minutes: 5 },
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
  if (week <= 2) return { phase: 'Làm quen', focus: 'Làm quen thanh điệu, thanh mẫu, vận mẫu và ghép pinyin ở trang Phát âm; áp dụng ngay trong HSK 1.', hsk: 'HSK 1 · bài 1–2', radicals: 'Học cấu tạo chữ và bộ thủ trong từng bài HSK; chưa cần học trước danh sách bộ.' }
  if (week <= 10) {
    const first = (week - 3) * 2 + 1
    return { phase: 'HSK 1', focus: 'Học từ trong câu, đọc to và ghi âm một đoạn giới thiệu ngắn mỗi tuần.', hsk: `HSK 1 · bài ${first}${first < 15 ? `–${first + 1}` : ''}`, radicals: 'Phần Chữ & bộ thủ ở đầu mỗi bài: khoảng 5 bộ mỗi bài.' }
  }
  if (week <= 18) {
    const first = (week - 11) * 2 + 1
    return { phase: 'HSK 2', focus: 'Tập trả lời thành câu về cuộc sống hằng ngày; ôn từ vựng theo danh sách HSK 2.0.', hsk: `HSK 2 · bài ${first}${first < 15 ? `–${first + 1}` : ''}`, radicals: 'Phần Chữ & bộ thủ ở đầu mỗi bài; tra Từ điển bộ thủ khi gặp bộ lạ.' }
  }
  if (week <= 22) return { phase: 'HSK 3–6', focus: 'Học tiếp từ vựng theo cấp, luyện nghe đọc và ôn các nhóm từ còn yếu.', hsk: 'Từ vựng HSK 2.0', radicals: 'Nhận mặt bộ hiếm; viết chữ thường dùng.' }
  return { phase: 'Ôn tập', focus: 'Mỗi tuần làm đề HSK có bấm giờ; luyện lại nhóm lỗi và ghi âm 3–5 phút.', hsk: 'Đề ôn HSK', radicals: 'Ôn những chữ hay viết sai.' }
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
