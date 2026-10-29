import { test, expect } from '@playwright/test'

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

test('a new learner completes seven short sessions and keeps progress after reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Bắt đầu buổi đầu tiên' }).click()
  await expect(page.getByRole('heading', { name: 'Bắt đầu từ số 0' })).toBeVisible()
  const answers = ['Đã nghe rõ, tôi sẵn sàng', 'Thanh 4', 'Đọc thành thanh 2', 'ni3 hao3', '您好 · nín hǎo', '不客气 · bú kèqi', 'xie4xie ni3']
  for (let i = 0; i < answers.length; i++) {
    if (i === 3 || i === 6) {
      if (i === 3) {
        await page.getByLabel('Câu trả lời bằng pinyin').fill('ni2 hao3')
        await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
        await expect(page.getByText('Đúng âm, sai hoặc thiếu thanh điệu')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Hoàn thành buổi này' })).toBeDisabled()
        await page.getByRole('button', { name: 'Thử lại', exact: true }).click()
      }
      await page.getByLabel('Câu trả lời bằng pinyin').fill(answers[i])
      await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
    } else await page.getByRole('button', { name: answers[i], exact: true }).click()
    await page.getByRole('button', { name: 'Hoàn thành buổi này' }).click()
    await expect(page.getByText('Đã hoàn thành ·', { exact: false })).toBeVisible()
    if (i < 6) await page.getByRole('link', { name: 'Buổi tiếp theo' }).click()
  }
  await page.reload()
  await expect(page.getByText('Đã hoàn thành 7/7 buổi', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Bắt đầu bài 1: Xin chào' }).click()
  await expect(page.getByText('Buổi này học 5 từ', { exact: false })).toBeVisible()
})

test('vocabulary is batched, listening is tested separately, and the next visit resumes unseen words', async ({ page }) => {
  await page.goto('/lesson/hsk1-01?part=vocab')
  const words = await page.evaluate(async () => {
    // @ts-expect-error Vite serves source modules for local UI tests.
    const { LESSONS } = await import('/src/data/course.ts')
    return LESSONS[0].words as { hanzi: string; meaning: string; pinyin: string }[]
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
    return { cards: await db.cards.toArray(), reviews: await db.reviews.toArray(), lesson: await db.lessonState.get('hsk1-01') }
  })
  expect(snapshot.cards).toHaveLength(15)
  expect(snapshot.reviews).toHaveLength(10)
  expect(snapshot.lesson?.done.vocab).toBeUndefined()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Đủ từ mới cho hôm nay rồi' })).toBeVisible()
  await page.getByRole('button', { name: 'Tôi muốn học thêm tối đa 3 từ' }).click()
  await expect(page.getByText('Buổi này học 3 từ', { exact: false })).toBeVisible()
  await expect(page.getByText('Sau khi xem từ, bạn sẽ luyện gõ và nghe.', { exact: true })).toBeVisible()
})

test('dictation and typing start with foundation sounds, and invalid tabs recover', async ({ page }) => {
  await page.goto('/pronunciation?tab=dictation')
  await expect(page.getByLabel('Phạm vi luyện tập')).toHaveValue('learned')
  await expect(page.getByText('Bạn chưa có từ đã học.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Nghe', exact: true }).click()
  expect(['妈', '麻', '马', '骂']).toContain(await page.evaluate(() => (window as unknown as { lastSpoken: string }).lastSpoken))
  await page.goto('/lesson/hsk1-01?part=invalid')
  await expect(page.getByText('Buổi này học 5 từ', { exact: false })).toBeVisible()
  await page.goto('/pronunciation?tab=invalid')
  await expect(page.getByRole('heading', { name: 'Quy tắc biến điệu' })).toBeVisible()
})

test('forgotten cards wait for their scheduled time, then become available again', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    // @ts-expect-error Local Vite test module.
    const { applyGrade, newCard, Rating } = await import('/src/lib/srs.ts')
    const row = applyGrade(newCard('recall', 'hsk1-01:ni', 'hsk1-01'), Rating.Again)
    await db.cards.add(row.card); await db.reviews.add(row.review)
  })
  await page.goto('/review')
  await expect(page.getByRole('heading', { name: 'Không có thẻ nào đến hạn' })).toBeVisible()
  await expect(page.getByText('Lượt ôn tiếp theo', { exact: false })).toBeVisible()
  await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    await db.cards.update('recall:hsk1-01:ni', { due: new Date(Date.now() - 1) })
  })
  await expect(page.getByLabel('Câu trả lời bằng pinyin')).toBeVisible({ timeout: 10000 })
  await page.getByRole('button', { name: 'Chưa nhớ, xem đáp án' }).click()
  await page.getByRole('button', { name: /^Quên/ }).click()
  await expect(page.getByRole('heading', { name: 'Đã ôn xong các thẻ đang đến hạn' })).toBeVisible()
  await expect(page.getByLabel('Câu trả lời bằng pinyin')).toHaveCount(0)
  await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    await db.cards.update('recall:hsk1-01:ni', { due: new Date(Date.now() - 1) })
  })
  await expect(page.getByLabel('Câu trả lời bằng pinyin')).toBeVisible({ timeout: 10000 })
})

test('backup can be downloaded, previewed and restored with explicit confirmation', async ({ page }) => {
  await page.goto('/start?session=start-01')
  await page.getByRole('button', { name: 'Đã nghe rõ, tôi sẵn sàng', exact: true }).click()
  await page.getByRole('button', { name: 'Hoàn thành buổi này' }).click()
  await page.goto('/stats')
  const downloading = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Tải bản sao lưu', exact: true }).click()
  const download = await downloading
  const path = await download.path()
  await page.getByLabel('Chọn tệp để khôi phục').setInputFiles(path!)
  await expect(page.getByText('Xem trước bản sao', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Xác nhận thay thế và khôi phục' }).click()
  await expect(page.getByText('Đã khôi phục tiến độ.', { exact: false })).toBeVisible()
  await page.goto('/start?session=start-01')
  await expect(page.getByText('Đã hoàn thành 1/7 buổi', { exact: true })).toBeVisible()
})

test('main study pages fit a narrow phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 })
  for (const route of ['/', '/start', '/lesson/hsk1-01?part=vocab', '/pronunciation?tab=pairs', '/lesson/hsk1-01?part=writing', '/stats']) {
    await page.goto(route)
    await expect(page.locator('main h1')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true)
    if (route === '/start' || route === '/') await page.screenshot({ path: test.info().outputPath(route === '/' ? 'home-mobile.png' : 'start-mobile.png'), fullPage: true })
  }
})

test('grammar distinguishes an attempted lesson from exercises answered correctly', async ({ page }) => {
  await page.goto('/lesson/hsk1-01?part=grammar')
  const order = page.getByText('Sắp xếp thành câu: “Chào các bạn!”', { exact: true }).locator('..')
  await order.getByRole('button', { name: '好', exact: true }).click()
  await order.getByRole('button', { name: '你们', exact: true }).click()
  await order.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
  for (let i = 0; i < 2; i++) {
    const input = page.getByLabel('Câu trả lời bằng pinyin').nth(i)
    await input.fill('wrong')
    await input.locator('..').getByRole('button', { name: 'Kiểm tra', exact: true }).click()
  }
  await page.getByRole('button', { name: 'Lưu bài học · cần luyện lại', exact: true }).click()
  await expect(page.getByText('Bạn đã học phần này, còn câu cần luyện lại.', { exact: false })).toBeVisible()
  await page.reload()
  await expect(page.getByText('Bạn đã học phần này, còn câu cần luyện lại.', { exact: false })).toBeVisible()
  const newOrder = page.getByText('Sắp xếp thành câu: “Chào các bạn!”', { exact: true }).locator('..')
  await newOrder.getByRole('button', { name: '你们', exact: true }).click()
  await newOrder.getByRole('button', { name: '好', exact: true }).click()
  await newOrder.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
  for (const [i, answer] of ['nin2 hao3', 'ni3 hao3'].entries()) {
    const input = page.getByLabel('Câu trả lời bằng pinyin').nth(i)
    await input.fill(answer)
    await input.locator('..').getByRole('button', { name: 'Kiểm tra', exact: true }).click()
  }
  await page.getByRole('button', { name: 'Hoàn thành và thêm câu vào lịch ôn', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Đã hoàn thành', exact: true })).toBeDisabled()
  const practice = await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    return (await db.lessonState.get('hsk1-01')).needsPractice.grammar
  })
  expect(practice).toBe(false)
})

test('reading review conceals pronunciation and meaning until the learner reveals them', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    // @ts-expect-error Local Vite test module.
    const { db } = await import('/src/lib/db.ts')
    // @ts-expect-error Local Vite test module.
    const { newCard } = await import('/src/lib/srs.ts')
    await db.cards.add(newCard('read', 'hsk1-01:ni', 'hsk1-01'))
  })
  await page.goto('/review')
  await expect(page.getByText('Nhận mặt chữ', { exact: true })).toBeVisible()
  await expect(page.getByText('bạn, anh, chị (ngôi thứ hai)', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Hiện cách đọc và nghĩa', exact: true }).click()
  await expect(page.getByText('bạn, anh, chị (ngôi thứ hai)', { exact: true })).toBeVisible()
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
