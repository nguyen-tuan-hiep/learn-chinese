import { expect, test } from '@playwright/test'
import type { Reading } from '../src/data/types'

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
  const fixture = await page.evaluate(async () => {
    // @ts-expect-error Local Vite module in browser tests.
    const { LESSONS } = await import('/src/data/course.ts')
    // @ts-expect-error Local Vite module in browser tests.
    const { segment } = await import('/src/components/lesson/ReadingPart.tsx')
    const lesson = LESSONS.find((l: { id: string }) => l.id === 'hsk4-01')
    const readings = lesson.readings as Reading[]
    const first = readings[0]
    const token = segment(first.sentences[0].hanzi).find((p: { word?: unknown }) => p.word)
    return { title: first.title, first: first.sentences[0], token: { text: token.text, meaning: token.word.meaning }, answers: readings.flatMap(r => r.questions.map(q => q.answer)) }
  })
  await expect(page.getByRole('heading', { name: '简单的爱情', level: 1 })).toBeVisible()
  const passage = page.getByRole('heading', { name: fixture.title, exact: true }).locator('../..')
  const line = passage.locator('ol > li').first()
  const pinyin = line.locator('span.font-medium.text-sm')
  await expect(pinyin).toHaveCount(0)
  await expect(line.getByText(fixture.first.vi, { exact: true })).toHaveCount(0)
  await passage.getByRole('button', { name: 'Pinyin', exact: true }).click()
  await expect(pinyin).toHaveText(fixture.first.pinyin)
  await passage.getByRole('button', { name: 'Bản dịch', exact: true }).click()
  await expect(line.getByText(fixture.first.vi, { exact: true })).toBeVisible()
  await line.getByRole('button', { name: `${fixture.token.text}: ${fixture.token.meaning}`, exact: true }).first().click()
  await expect(line.getByRole('status')).toContainText(fixture.token.meaning)
  await passage.getByRole('button', { name: '▶ Nghe cả bài' }).click()
  await expect.poll(() => page.evaluate(() => (window as unknown as { lastSpoken?: string }).lastSpoken)).toBe(fixture.first.hanzi)
  const questions = page.getByRole('heading', { name: 'Câu hỏi đọc hiểu', exact: true }).locator('..')
  for (const [index, answer] of fixture.answers.entries()) await questions.locator('ol > li').nth(index).getByRole('button', { name: new RegExp(`^${String.fromCharCode(65 + answer)}\\.`) }).click()
  const total = fixture.answers.length
  expect(total).toBeGreaterThan(0)
  await page.getByRole('button', { name: `Hoàn thành · đúng ${total}/${total}`, exact: true }).click()
  await expect(page.getByText(`Đã lưu · đúng ${total}/${total} câu`, { exact: false })).toBeVisible()
  const saved = await page.evaluate(async () => {
    // @ts-expect-error Local Vite module in browser tests.
    const { db } = await import('/src/lib/db.ts')
    return { done: !!(await db.lessonState.get('hsk4-01'))?.done.reading, cards: await db.cards.where('kind').equals('sentence').count() }
  })
  expect(saved.done).toBe(true)
  expect(saved.cards).toBeGreaterThan(0)
})

test('from HSK 4 on, the characters part ends with sound-part families', async ({ page }) => {
  await page.goto('/lesson/hsk4-01?part=chars')
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
  const done = await page.evaluate(async () => {
    // @ts-expect-error Local Vite module in browser tests.
    const { db } = await import('/src/lib/db.ts')
    return !!(await db.lessonState.get('hsk4-01'))?.done.chars
  })
  expect(done).toBe(true)
})
