import { test, expect } from '@playwright/test'

test('homepage offers four areas, an introduction action and consistent navigation', async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Học tiếng Trung từng bước' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Bắt đầu học' })).toHaveAttribute('href', '/pronunciation?tab=intro')
    await expect(page.getByRole('link', { name: 'Trang chủ', exact: true })).toHaveAttribute('aria-current', 'page')
    await expect(page.getByRole('link', { name: 'Hôm nay', exact: true })).toHaveCount(0)
    const areas = page.getByRole('region', { name: 'Khám phá các phần học' })
    for (const [name, href] of [['Phát âm', '/pronunciation?tab=intro'], ['Giáo trình', '/course'], ['Bộ thủ', '/radicals'], ['Ôn tập', '/review']]) {
      await expect(areas.getByRole('link', { name: new RegExp(name) })).toHaveAttribute('href', href)
    }
    const positions = await areas.getByRole('link').evaluateAll(nodes => nodes.map(n => n.getBoundingClientRect().y))
    expect(new Set(positions).size).toBe(width < 1024 ? 2 : 1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    await page.screenshot({ path: test.info().outputPath(`home-${width}.png`), fullPage: true })
    await page.getByRole('link', { name: 'Bắt đầu học' }).focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/pronunciation\?tab=intro/)
  }
})

test('homepage action follows pronunciation and HSK progress, including completion', async ({ page }) => {
  await page.goto('/')
  const setProgress = async (mode: string) => {
    await page.evaluate(async mode => {
      // @ts-expect-error Vite source modules for browser testing.
      const { db } = await import('/src/lib/db.ts')
      // @ts-expect-error Vite source modules for browser testing.
      const { PRONUNCIATION_UNITS } = await import('/src/data/pronunciationLearning.ts')
      // @ts-expect-error Vite source modules for browser testing.
      const { LESSONS } = await import('/src/data/course.ts')
      await db.lessonState.clear()
      if (mode === 'pronunciation') await db.lessonState.bulkPut(PRONUNCIATION_UNITS.slice(0, 2).map((u: { id: string }) => ({ lessonId: u.id, done: { dialogue: 1 } })))
      if (mode === 'ready') await db.lessonState.bulkPut(PRONUNCIATION_UNITS.map((u: { id: string }) => ({ lessonId: u.id, done: { dialogue: 1 } })))
      if (mode === 'hsk') await db.lessonState.put({ lessonId: 'hsk1-01', done: { pronunciation: 1 } })
      if (mode === 'finished') await db.lessonState.bulkPut(LESSONS.map((l: { id: string }) => ({ lessonId: l.id, done: {}, skipped: true })))
    }, mode)
  }
  for (const [mode, label, href] of [
    ['pronunciation', 'Tiếp tục học', '/pronunciation?tab=tones'],
    ['ready', 'Tiếp tục học', '/lesson/hsk1-01?part=pronunciation'],
    ['hsk', 'Tiếp tục học', '/lesson/hsk1-01?part=dialogue'],
    ['finished', 'Tiếp tục học', '/course'],
  ]) {
    await setProgress(mode)
    await expect(page.getByRole('link', { name: label, exact: false }).first()).toHaveAttribute('href', href)
  }
  await page.reload()
  await expect(page.getByRole('link', { name: 'Tiếp tục học' })).toHaveAttribute('href', '/course')
})

test('return links use the homepage name and curriculum links lead to course', async ({ page }) => {
  await page.goto('/review')
  await expect(page.getByRole('button', { name: 'Về trang chủ' }).locator('..')).toHaveAttribute('href', '/')
  await page.goto('/radicals')
  await expect(page.getByRole('button', { name: 'Tiếp tục lộ trình' }).locator('..')).toHaveAttribute('href', '/course')
})
