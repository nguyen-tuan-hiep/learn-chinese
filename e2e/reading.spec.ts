import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.speechSynthesis.speak = (u) => {
      ;(window as unknown as { lastSpoken: string }).lastSpoken = u.text
      setTimeout(() => u.dispatchEvent(new Event('start')), 0)
      setTimeout(() => u.dispatchEvent(new Event('end')), 50)
    }
    window.speechSynthesis.cancel = () => {}
  })
  await page.route('**/node_modules/.vite/deps/hanzi-writer.js*', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: `export default { create(host) {
      host.innerHTML = '<button type="button">Viết xong nét thử</button>';
      const button = host.querySelector('button');
      return { animateCharacter() {}, cancelQuiz() {}, quiz(options) {
        button.onclick = () => options.onComplete({ totalMistakes: 0 });
      }};
    }};`,
  }))
})

test('an HSK 4 reading shows pinyin and word meanings on demand, then checks comprehension', async ({ page }) => {
  await page.goto('/lesson/hsk4-01?part=reading')
  await expect(page.getByRole('heading', { name: '第一次坐动车', level: 3 })).toBeVisible()
  await expect(page.getByText('Chūxíng yǐqián', { exact: false })).toHaveCount(0)
  await page.getByRole('button', { name: 'Pinyin', exact: true }).click()
  await expect(page.getByText('Chūxíng yǐqián', { exact: false }).first()).toBeVisible()
  await page.getByRole('button', { name: /^乘坐:/ }).first().click()
  await expect(page.getByRole('status').filter({ hasText: 'đi (xe, tàu, máy bay)' })).toBeVisible()
  await page.getByRole('button', { name: '▶ Nghe cả bài' }).click()
  await expect.poll(() => page.evaluate(() => (window as unknown as { lastSpoken?: string }).lastSpoken)).toBeTruthy()
  for (const [q, choice] of [[0, 'B'], [1, 'C'], [2, 'B'], [3, 'B']] as const) {
    await page.locator('ol').last().locator('li').nth(q).getByRole('button', { name: new RegExp(`^${choice}\\.`) }).click()
  }
  await page.getByRole('button', { name: 'Hoàn thành · đúng 4/4' }).click()
  await expect(page.getByText('Đã lưu · đúng 4/4 câu', { exact: false })).toBeVisible()
  const saved = await page.evaluate(async () => {
    // @ts-expect-error Local Vite module in browser tests.
    const { db } = await import('/src/lib/db.ts')
    return { done: !!(await db.lessonState.get('hsk4-01'))?.done.reading, cards: await db.cards.where('kind').equals('sentence').count() }
  })
  expect(saved.done).toBe(true)
  expect(saved.cards).toBeGreaterThan(0)
})

test('from HSK 4 on, the characters part ends with sound-part families', async ({ page }) => {
  await page.goto('/lesson/hsk4-01')
  const taught = await page.evaluate(async () => {
    // @ts-expect-error Local Vite module in browser tests.
    const { lessonRadicals } = await import('/src/lib/lessonRadicals.ts')
    return lessonRadicals('hsk4-01').taught.length as number
  })
  await page.getByRole('button', { name: taught ? /^Học bộ đầu tiên/ : 'Xem họ âm →' }).click()
  for (let i = 0; i < taught; i++) {
    await page.getByRole('button', { name: 'Bước tiếp theo →' }).click()
    await page.getByRole('button', { name: 'Viết xong nét thử' }).click()
    await page.getByRole('button', { name: 'Bước tiếp theo →' }).click()
    await page.getByRole('button', { name: i === taught - 1 ? 'Xem họ âm →' : /^Bộ tiếp theo/ }).click()
  }
  await expect(page.getByRole('heading', { name: /Họ âm/ })).toBeVisible()
  await expect(page.getByLabel(/^Họ âm /).first()).toBeVisible()
  await page.getByRole('button', { name: 'Hoàn thành phần này' }).click()
  await expect(page.getByRole('link', { name: 'Sang phần Từ vựng →' })).toBeVisible()
})
