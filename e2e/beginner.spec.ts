import { test, expect } from '@playwright/test'
import type { GrammarPoint } from '../src/data/types'

// Exercise the learning UI without requiring a voice to be installed on the test machine.
// Audio accuracy itself must still be checked with a real Mandarin voice.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.speechSynthesis.speak = (u) => {
      ;(window as unknown as { lastSpoken: string }).lastSpoken = u.text
      setTimeout(() => u.dispatchEvent(new Event('start')), 0)
      setTimeout(() => u.dispatchEvent(new Event('end')), 180)
    }
    window.speechSynthesis.cancel = () => {}
  })
})

test('pronunciation integrates foundations and course starts directly at HSK 1', async ({ page }) => {
  await page.goto('/course')
  await expect(page.getByRole('button', { name: /Chặng 1 ·/ })).toBeVisible()
  await expect(page.getByText(/Chặng 0/)).toHaveCount(0)
  await page.goto('/pronunciation?tab=intro')
  await page.getByRole('button', { name: 'Biết cách đọc tiếng Trung', exact: true }).click()
  await expect(page.getByText('Đã hoàn thành 1/7 mục nền tảng', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Hoàn thành mục này' })).toHaveCount(0)
  await page.getByRole('button', { name: 'a', exact: true }).click()
  await expect(page.getByText('Đã hoàn thành 2/7 mục nền tảng', { exact: true })).toBeVisible()
  await page.goto('/pronunciation?tab=tones')
  await page.locator('fieldset').getByRole('button', { name: 'Nghe', exact: true }).click()
  expect(await page.evaluate(() => (window as unknown as { lastSpoken: string }).lastSpoken)).toBe('骂')
  await page.getByRole('button', { name: 'Thanh 4', exact: true }).click()
  await expect(page.getByText('Đã hoàn thành 3/7 mục nền tảng', { exact: true })).toBeVisible()
  await page.goto('/pronunciation?tab=initials')
  await page.getByRole('button', { name: 'p bật hơi rõ hơn b', exact: true }).click()
  await expect(page.getByText('Đã hoàn thành 4/7 mục nền tảng', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Vận mẫu', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Giữ lưỡi như i, tròn môi như u', exact: true })).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByText('Đã hoàn thành 4/7 mục nền tảng', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Giữ lưỡi như i, tròn môi như u', exact: true }).click()
  await expect(page.getByText('Đã hoàn thành 5/7 mục nền tảng', { exact: true })).toBeVisible()
  await page.goto('/pronunciation?tab=typing')
  await expect(page.getByRole('heading', { name: 'Ghép âm và gõ pinyin', exact: true })).toHaveCount(0)
  const activity = page.locator('#typing-practice')
  await expect(activity.getByText(/iou → iu/)).toBeVisible()
  const hanzi = await activity.locator('.font-han.text-4xl').innerText()
  const expected: Record<string, string> = { '妈': 'ma1', '麻': 'ma2', '马': 'ma3', '骂': 'ma4' }
  await activity.getByLabel('Câu trả lời bằng pinyin').fill(expected[hanzi])
  await expect(page.getByText('Đã hoàn thành 5/7 mục nền tảng', { exact: true })).toBeVisible()
  await activity.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
  await expect(page.getByText('Đã hoàn thành 6/7 mục nền tảng', { exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByText('Đã hoàn thành 6/7 mục nền tảng', { exact: true })).toBeVisible()
  await page.goto('/start?session=foundation-05')
  await expect(page).toHaveURL(/pronunciation\?tab=finals/)
  await expect(page.getByRole('button', { name: /không có âm Việt tương đương sát/ }).first()).toBeVisible()
})

test('pronunciation restores sound tiles, keeps the new reference and fits a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/pronunciation?tab=initials')
  await expect(page.getByRole('button', { name: /p bật hơi/ }).first()).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375)
  await page.screenshot({ path: test.info().outputPath('pronunciation-tiles-mobile.png') })
  await page.goto('/pronunciation?tab=chart')
  await page.getByLabel('Nhóm âm').selectOption('finals')
  await page.getByLabel('Tìm âm pinyin').fill('ü')
  await expect(page.getByRole('rowheader', { name: 'ü', exact: true })).toBeVisible()
  await page.getByLabel('Tìm âm pinyin').fill('zzzzz')
  await expect(page.getByRole('status')).toHaveText(/Không tìm thấy/)
  await page.goto('/pronunciation?tab=check')
  const fields = page.locator('fieldset')
  await fields.nth(0).getByRole('button', { name: 'Thanh 4', exact: true }).click()
  await expect(fields.nth(0).getByRole('link', { name: 'Ôn lại nhóm âm' })).toHaveAttribute('href', '/pronunciation?tab=tones')
  for (const [index, answer] of ['Thanh 1', 'qī', 'in'].entries()) await fields.nth(index).getByRole('button', { name: answer, exact: true }).click()
  await expect(page.getByText('Đã hoàn thành 1/7 mục nền tảng', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Vào HSK 1 · Bài 1' })).toHaveCount(0)
})

test('vocabulary is batched, listening is tested separately, and the next visit resumes unseen words', async ({ page }) => {
  await page.goto('/lesson/hsk1-03?part=vocab')
  const words = await page.evaluate(async () => {
    // @ts-expect-error Vite serves source modules for local UI tests.
    const { LESSONS } = await import('/src/data/course.ts')
    return LESSONS.find((l: { id: string }) => l.id === 'hsk1-03').words as { hanzi: string; meaning: string; pinyin: string }[]
  })
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Tiếp →', exact: true }).click()
  await page.getByRole('button', { name: 'Luyện gõ pinyin' }).click()
  for (let i = 0; i < 5; i++) {
    const meaning = await page.locator('.text-center.mb-6 .text-2xl').innerText()
    const word = words.find((w) => w.meaning === meaning)!
    await page.getByLabel('Câu trả lời bằng pinyin').fill(word.pinyin)
    await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
    await page.getByRole('button', { name: /^Tiếp/ }).click()
  }
  for (let i = 0; i < 5; i++) {
    await expect(page.getByRole('heading', { name: `Nghe hiểu · từ ${i + 1}/5` })).toBeVisible()
    await page.getByRole('button', { name: 'Nghe', exact: true }).click()
    const hanzi = await page.evaluate(() => (window as unknown as { lastSpoken: string }).lastSpoken)
    await page.getByRole('button', { name: words.find((w) => w.hanzi === hanzi)!.meaning, exact: true }).click()
    await page.getByRole('button', { name: i < 4 ? 'Từ tiếp theo' : 'Lưu buổi học' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Đã lưu 5 từ' })).toBeVisible()
  const snapshot = await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    return { cards: await db.cards.toArray(), reviews: await db.reviews.toArray(), lesson: await db.lessonState.get('hsk1-03') }
  })
  expect(snapshot.cards).toHaveLength(15)
  expect(snapshot.reviews).toHaveLength(10)
  expect(snapshot.lesson?.done.vocab).toBeUndefined()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Đủ từ mới cho hôm nay rồi' })).toBeVisible()
  await page.getByRole('button', { name: 'Tôi muốn học thêm tối đa 3 từ' }).click()
  await expect(page.getByText('Buổi này học 3 từ', { exact: false })).toBeVisible()
  await expect(page.getByText('Sau khi xem từ, bạn sẽ luyện gõ và nghe.', { exact: false })).toBeVisible()
})

test('typing starts with foundation sounds and the removed dictation tab falls back safely', async ({ page }) => {
  await page.goto('/pronunciation?tab=typing')
  await expect(page.getByLabel('Phạm vi luyện tập')).toHaveValue('learned')
  await expect(page.getByText('Bạn chưa có từ đã học.', { exact: false })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Nghe chép', exact: true })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: '3. Luyện gõ', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Ghép âm và gõ pinyin', exact: true })).toHaveCount(0)
  await page.goto('/pronunciation?tab=dictation')
  await expect(page.getByRole('heading', { name: 'Quy tắc biến điệu' })).toBeVisible()
})

test('forgotten cards wait for their scheduled time, then become available again', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    // @ts-expect-error Local Vite test module.
    const { applyGrade, newCard, Rating } = await import('/src/lib/srs.ts')
    // @ts-expect-error Local Vite test module.
    const { WORDS } = await import('/src/data/course.ts')
    const [ref, { lesson }] = [...WORDS.entries()].find(([, entry]: [string, { word: { hanzi: string } }]) => entry.word.hanzi === '你')
    const row = applyGrade(newCard('recall', ref, lesson.id), Rating.Again)
    await db.cards.add(row.card); await db.reviews.add(row.review)
  })
  await page.goto('/review')
  await expect(page.getByRole('heading', { name: 'Không có thẻ nào đến hạn' })).toBeVisible()
  await expect(page.getByText('Lượt ôn tiếp theo', { exact: false })).toBeVisible()
  await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    const card = await db.cards.where('kind').equals('recall').first()
    await db.cards.update(card.id, { due: new Date(Date.now() - 1) })
  })
  await expect(page.getByLabel('Câu trả lời bằng pinyin')).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'Chưa nhớ, xem đáp án' }).click()
  await page.getByRole('button', { name: /^Quên/ }).click()
  await expect(page.getByRole('heading', { name: 'Đã ôn xong các thẻ đang đến hạn' })).toBeVisible()
  await expect(page.getByLabel('Câu trả lời bằng pinyin')).toHaveCount(0)
  await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    const card = await db.cards.where('kind').equals('recall').first()
    await db.cards.update(card.id, { due: new Date(Date.now() - 1) })
  })
  await expect(page.getByLabel('Câu trả lời bằng pinyin')).toBeVisible({ timeout: 10000 })
})

test('backup can be downloaded, previewed and restored with explicit confirmation', async ({ page }) => {
  await page.goto('/start?session=foundation-01')
  await page.getByRole('button', { name: 'Biết cách đọc tiếng Trung', exact: true }).click()
  await expect(page.getByText('Đã hoàn thành 1/7 mục nền tảng', { exact: true })).toBeVisible()
  await page.goto('/stats')
  const downloading = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Tải bản sao lưu', exact: true }).click()
  const download = await downloading
  const path = await download.path()
  await page.getByLabel('Chọn tệp để khôi phục').setInputFiles(path!)
  await expect(page.getByText('Xem trước bản sao', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Xác nhận thay thế và khôi phục' }).click()
  await expect(page.getByText('Đã khôi phục tiến độ.', { exact: false })).toBeVisible()
  await page.goto('/start?session=foundation-01')
  await expect(page.getByText('Đã hoàn thành 1/7 mục nền tảng', { exact: true })).toBeVisible()
})

test('main study pages fit a narrow phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 })
  for (const route of ['/', '/start', '/radicals', '/radicals/radicals-01', '/lesson/hsk1-01?part=vocab', '/pronunciation?tab=pairs', '/lesson/hsk1-01?part=writing', '/stats']) {
    await page.goto(route)
    await expect(page.locator('main h1')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true)
    if (route === '/start' || route === '/' || route === '/radicals') await page.screenshot({ path: test.info().outputPath(route === '/' ? 'home-mobile.png' : route === '/start' ? 'start-mobile.png' : 'radicals-mobile.png'), fullPage: true })
  }
})

test('grammar distinguishes an attempted lesson from exercises answered correctly', async ({ page }) => {
  await page.goto('/lesson/hsk1-03?part=grammar')
  const points = await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { LESSONS } = await import('/src/data/course.ts')
    return LESSONS.find((l: { id: string }) => l.id === 'hsk1-03').grammar as GrammarPoint[]
  })
  expect(points.length).toBeGreaterThan(0)
  const answerAll = async (correct: boolean) => {
    for (const point of points) {
      const card = page.getByRole('heading', { name: point.title, exact: true }).locator('..')
      for (const drill of point.drills) {
        if (drill.type === 'order') {
          const order = card.getByText(`Sắp xếp thành câu: “${drill.vi}”`, { exact: true }).locator('..')
          const pool = order.locator('> div').nth(1)
          for (const token of correct ? drill.tokens : [...drill.tokens].reverse()) {
            await pool.getByRole('button', { name: token, exact: true }).and(page.locator('button:enabled')).first().click()
          }
          await order.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
        } else {
          const activity = card.getByText(`Nói bằng tiếng Trung (gõ pinyin): “${drill.vi}”`, { exact: true }).locator('..')
          await activity.getByLabel('Câu trả lời bằng pinyin').fill(correct ? drill.pinyin : 'wrong')
          await activity.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
        }
      }
    }
  }
  await answerAll(false)
  await page.getByRole('button', { name: 'Lưu bài học · cần luyện lại', exact: true }).click()
  await expect(page.getByText('Bạn đã học phần này, còn câu cần luyện lại.', { exact: false })).toBeVisible()
  await page.reload()
  await expect(page.getByText('Bạn đã học phần này, còn câu cần luyện lại.', { exact: false })).toBeVisible()
  await answerAll(true)
  await page.getByRole('button', { name: 'Hoàn thành và thêm câu vào lịch ôn', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Đã hoàn thành', exact: true })).toBeDisabled()
  const practice = await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    return (await db.lessonState.get('hsk1-03')).needsPractice.grammar
  })
  expect(practice).toBe(false)
})

test('reading review conceals pronunciation and meaning until the learner reveals them', async ({ page }) => {
  await page.goto('/')
  const word = await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    // @ts-expect-error Local Vite test module.
    const { newCard } = await import('/src/lib/srs.ts')
    // @ts-expect-error Local Vite test module.
    const { WORDS } = await import('/src/data/course.ts')
    const [ref, { word, lesson }] = [...WORDS.entries()].find(([, entry]: [string, { word: { hanzi: string } }]) => entry.word.hanzi === '你')
    await db.cards.add(newCard('read', ref, lesson.id))
    return { pinyin: word.pinyin, meaning: word.meaning }
  })
  await page.goto('/review')
  await expect(page.getByText('Nhận mặt chữ', { exact: true })).toBeVisible()
  await expect(page.getByText(word.meaning, { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Hiện cách đọc và nghĩa', exact: true }).click()
  await expect(page.getByText(word.meaning, { exact: true })).toBeVisible()
})

test('writing recall hides the model and records the use of a hint', async ({ page }) => {
  // Substitute the drawing engine to check concealment, retry and saved skill state.
  // Real stroke matching is supplied by Hanzi Writer and needs device-level verification.
  await page.route('**/node_modules/.vite/deps/hanzi-writer.js*', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: `export default { create(host) {
      host.innerHTML = '<button type="button" style="padding:16px">Hoàn thành nét thử</button>';
      const button = host.querySelector('button');
      return { animateCharacter() {}, cancelQuiz() {}, quiz(options) {
        button.onclick = () => options.onComplete({ totalMistakes: 0 });
      }};
    }};`,
  }))
  await page.goto('/')
  await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    // @ts-expect-error Local Vite test module.
    const { LESSONS, newCharacters } = await import('/src/data/course.ts')
    // @ts-expect-error Local Vite test module.
    const { newCard } = await import('/src/lib/srs.ts')
    await db.cards.bulkAdd(newCharacters(LESSONS[0]).filter((ch: string) => ch !== '你').map((ch: string) => newCard('write', ch, 'hsk1-01')))
  })
  await page.goto('/lesson/hsk1-01?part=writing')
  await page.getByRole('button', { name: 'Bước tiếp', exact: true }).click()
  const draw = async () => {
    await page.getByRole('button', { name: 'Hoàn thành nét thử', exact: true }).click()
    await expect(page.getByText('Không sai nét nào', { exact: true })).toBeVisible()
  }
  await draw()
  await page.getByRole('button', { name: 'Bước tiếp', exact: true }).click()
  await expect(page.getByText('Tự viết từ trí nhớ', { exact: true })).toBeVisible()
  await expect(page.getByText('你', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Chưa nhớ, tô lại mẫu', exact: true }).click()
  await expect(page.getByText('你', { exact: true }).first()).toBeVisible()
  await draw()
  await page.getByRole('button', { name: 'Bước tiếp', exact: true }).click()
  await draw()
  await page.getByRole('button', { name: 'Lưu nhóm chữ này', exact: true }).click()
  await expect(page.getByText('Đã thêm 1 chữ vào lịch ôn viết.', { exact: true })).toBeVisible()
  const state = await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    return (await db.cards.get('write:你')).state
  })
  expect(state).toBe(1)
})
