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
  await expect(page.getByRole('heading', { name: 'Từ điển bộ thủ' })).toBeVisible()
  await page.getByPlaceholder('Ví dụ: nước, 氵, 85').fill('氵')
  await expect(page.getByText('1 bộ phù hợp')).toBeVisible()
  await page.getByRole('button', { name: /#85/ }).click()
  const entry = page.getByLabel('Bộ 水')
  await expect(entry.getByRole('heading', { name: 'nước' })).toBeVisible()
  await expect(entry.getByRole('link', { name: /Học ở HSK 1 · Bài 1/ })).toBeVisible()
  await page.getByText('Luyện thêm viết bộ thủ', { exact: false }).click()
  await page.getByRole('link', { name: /^Buổi 1\b/ }).click()
  const lessonRadicals = await page.evaluate(async () => {
    // @ts-expect-error Local Vite module in browser tests.
    const { RADICAL_LESSONS } = await import('/src/data/radicals.ts')
    return RADICAL_LESSONS[0].radicals.map((r: { id: number; writingGlyph: string }) => ({ id: r.id, glyph: r.writingGlyph })) as { id: number; glyph: string }[]
  })
  for (const [i, radical] of lessonRadicals.entries()) {
    const glyph = radical.glyph
    await page.getByRole('button', { name: glyph, exact: true }).click()
    await page.getByRole('button', { name: 'Bước tiếp theo' }).click()
    await page.getByRole('button', { name: 'Bước tiếp theo' }).click()
    await page.getByRole('button', { name: 'Viết xong nét thử' }).click()
    await page.getByRole('button', { name: 'Bước tiếp theo' }).click()
    await page.getByRole('button', { name: 'Viết xong nét thử' }).click()
    await page.getByRole('button', { name: 'Bước tiếp theo' }).click()
    await expect(page.getByRole('group', { name: `Sơ đồ chữ của bộ ${glyph}` })).toBeVisible()
    if (i === 1) {
      const memberButton = page.getByRole('button', { name: /^Chữ / }).first()
      const label = await memberButton.getAttribute('aria-label')
      const char = label!.match(/^Chữ (.+?):/)![1]
      await memberButton.click()
      await expect(page.getByText(`Từ vựng có chữ ${char}`, { exact: false })).toBeVisible()
      const answer = await page.evaluate(async () => {
        // @ts-expect-error Local Vite module in browser tests.
        const { RADICAL_BY_ID } = await import('/src/data/radicals.ts')
        // @ts-expect-error Local Vite module in browser tests.
        const { composeQuestions } = await import('/src/lib/radicalFamily.ts')
        return composeQuestions(RADICAL_BY_ID.get(9))[0].answer as string
      })
      await page.getByRole('button', { name: `Chọn ${answer}`, exact: true }).click()
      await expect(page.getByText('Đúng rồi!', { exact: false })).toBeVisible()
    }
    await page.getByRole('button', { name: i === lessonRadicals.length - 1 ? 'Hoàn thành buổi' : 'Bước tiếp theo' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Đã hoàn thành buổi này' })).toBeVisible()
  await page.reload()
  await expect(page.getByText('Đã hoàn thành, có thể luyện lại')).toBeVisible()
  const saved = await page.evaluate(async () => {
    // @ts-expect-error Local Vite module in browser tests.
    const { db } = await import('/src/lib/db.ts')
    return { count: await db.cards.where('kind').equals('radical').count(), done: !!(await db.lessonState.get('radicals-01'))?.done.radical }
  })
  expect(saved).toEqual({ count: lessonRadicals.length, done: true })
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
  await expect(page.getByText('Bộ này nghĩa là gì?', { exact: false })).toBeVisible()
  await expect(page.getByText('người', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Hiện nghĩa và chữ ví dụ' }).click()
  await expect(page.getByText('người', { exact: true })).toBeVisible()
  await expect(page.getByText('học ở HSK 1 Bài 1', { exact: false })).toBeVisible()
})

test('the supplemental characters section teaches radicals and saves progress', async ({ page }) => {
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
  await page.goto('/lesson/hsk1-01?part=chars')
  const taught = await page.evaluate(async () => {
    // @ts-expect-error Local Vite module in browser tests.
    const { lessonRadicals } = await import('/src/lib/lessonRadicals.ts')
    const info = lessonRadicals('hsk1-01')
    return { glyphs: info.taught.map((r: { writingGlyph: string }) => r.writingGlyph) as string[], charCount: info.chars.length as number }
  })
  await expect(page.getByRole('heading', { name: new RegExp(`${taught.charCount} chữ mới trong bài, học ${taught.glyphs.length} bộ hôm nay`) })).toBeVisible()
  await page.getByRole('button', { name: /^Học bộ đầu tiên/ }).click()
  for (let i = 0; i < taught.glyphs.length; i++) {
    await page.getByRole('button', { name: 'Bước tiếp theo →' }).click()
    await page.getByRole('button', { name: 'Viết xong nét thử' }).click()
    await page.getByRole('button', { name: 'Bước tiếp theo →' }).click()
    await expect(page.getByRole('group', { name: `Sơ đồ chữ của bộ ${taught.glyphs[i]}` })).toBeVisible()
    await page.getByRole('button', { name: i === taught.glyphs.length - 1 ? 'Hoàn thành phần này' : /^Bộ tiếp theo/ }).click()
  }
  await expect(page.getByText(`Đã học ${taught.glyphs.length} bộ`, { exact: false })).toBeVisible()
  const saved = await page.evaluate(async () => {
    // @ts-expect-error Local Vite module in browser tests.
    const { db } = await import('/src/lib/db.ts')
    return { count: await db.cards.where('kind').equals('radical').count(), done: !!(await db.lessonState.get('hsk1-01'))?.done.chars }
  })
  expect(saved).toEqual({ count: taught.glyphs.length, done: true })
})
