import { expect, test } from '@playwright/test'

test('catalog searches variants and a radical lesson records progress and review cards', async ({ page }) => {
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
  await page.goto('/radicals')
  await page.getByPlaceholder('Ví dụ: nước, 氵, 85').fill('氵')
  await expect(page.getByText('1 bộ phù hợp')).toBeVisible()
  await expect(page.getByRole('link', { name: /#85/ })).toBeVisible()
  await page.getByRole('link', { name: /#85/ }).click()
  await expect(page.locator('#radical-85').getByRole('heading', { name: 'nước' })).toBeVisible()
  await page.getByRole('link', { name: 'Tất cả bộ thủ' }).click()
  await page.getByRole('link', { name: 'Bắt đầu bộ thủ' }).click()
  for (let i = 0; i < 5; i++) {
    const glyph = ['一', '人', '八', '刀', '力'][i]
    await page.getByRole('button', { name: glyph, exact: true }).click()
    await page.getByRole('button', { name: 'Bước tiếp theo' }).click()
    await page.getByRole('button', { name: 'Bước tiếp theo' }).click()
    await page.getByRole('button', { name: 'Viết xong nét thử' }).click()
    await page.getByRole('button', { name: 'Bước tiếp theo' }).click()
    await page.getByRole('button', { name: 'Viết xong nét thử' }).click()
    await page.getByRole('button', { name: i === 4 ? 'Hoàn thành buổi' : 'Bước tiếp theo' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Đã hoàn thành buổi này' })).toBeVisible()
  await page.reload()
  await expect(page.getByText('Đã hoàn thành, có thể luyện lại')).toBeVisible()
  const saved = await page.evaluate(async () => {
    // @ts-expect-error Local Vite module in browser tests.
    const { db } = await import('/src/lib/db.ts')
    return { count: await db.cards.where('kind').equals('radical').count(), done: !!(await db.lessonState.get('radicals-01'))?.done.radical }
  })
  expect(saved).toEqual({ count: 5, done: true })
})

test('rare writing forms fall back to manual practice when stroke data is unavailable', async ({ page }) => {
  await page.route('**/node_modules/.vite/deps/hanzi-writer.js*', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: `export default { create(host, char, options) {
      setTimeout(() => options.onLoadCharDataError(), 0);
      return { animateCharacter() {}, cancelQuiz() {}, quiz() {} };
    }};`,
  }))
  await page.goto('/radicals/radicals-43')
  const glyph = await page.locator('h2').first().innerText()
  expect(glyph).toBeTruthy()
  await page.getByRole('button', { name: /龠|龜|龍|齒/ }).first().click()
  await page.getByRole('button', { name: 'Bước tiếp theo' }).click()
  await page.getByRole('button', { name: 'Bước tiếp theo' }).click()
  await expect(page.getByText('Dạng này chưa có dữ liệu thứ tự nét.', { exact: false })).toBeVisible()
  const pad = page.getByRole('img', { name: /Bảng luyện viết/ })
  const box = await pad.boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.move(box!.x + 50, box!.y + 50)
  await page.mouse.down()
  await page.mouse.move(box!.x + 100, box!.y + 100)
  await page.mouse.up()
  await page.getByRole('button', { name: 'Tôi viết được' }).click()
  await expect(page.getByText('Đã viết xong.')).toBeVisible()
})

test('radical review keeps the glyph hidden until the learner reveals it', async ({ page }) => {
  await page.route('**/node_modules/.vite/deps/hanzi-writer.js*', (route) => route.fulfill({
    contentType: 'application/javascript', body: `export default { create() { return { animateCharacter() {}, cancelQuiz() {}, quiz() {} } } };`,
  }))
  await page.goto('/')
  await page.evaluate(async () => {
    // @ts-expect-error Local Vite module in browser tests.
    const { db } = await import('/src/lib/db.ts')
    // @ts-expect-error Local Vite module in browser tests.
    const { newCard } = await import('/src/lib/srs.ts')
    await db.cards.add(newCard('radical', '9', 'radicals-01'))
  })
  await page.goto('/review')
  await expect(page.getByText('Nhớ bộ thủ', { exact: true })).toBeVisible()
  await expect(page.getByText('người', { exact: true })).toBeVisible()
  await expect(page.getByText('Đáp án:', { exact: false })).toHaveCount(0)
  await page.getByRole('button', { name: 'Tôi không nhớ, cho xem bộ thủ' }).click()
  await expect(page.getByText('Đáp án:', { exact: false })).toBeVisible()
})
