import { test, expect } from '@playwright/test'

test('course titles have Chinese and Vietnamese titles on line one and colored pinyin on line two', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/course')
  const toggle = page.getByRole('button', { name: /Chặng 1 ·/ })
  if (await toggle.getAttribute('aria-expanded') === 'false') await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  const panel = page.locator('#stage-panel-hsk1')
  await expect(panel).toHaveCSS('height', /[1-9][0-9.]*px/)
  const row = panel.locator('li').first()
  const pinyin = row.getByText('Nǐ', { exact: true })
  await expect(pinyin).toHaveClass(/text-tone3/)
  await expect(row.getByText('hǎo', { exact: true })).toHaveClass(/text-tone3/)
  const titleLine = row.locator('[lang="zh-CN"]').first().locator('..')
  const titleBox = await titleLine.boundingBox()
  const pinyinBox = await pinyin.locator('..').boundingBox()
  expect(pinyinBox!.y).toBeGreaterThanOrEqual(titleBox!.y + titleBox!.height)
  const titlePositions = await titleLine.evaluate(el => [...el.children].map(child => ({ top: child.getBoundingClientRect().top, bottom: child.getBoundingClientRect().bottom })))
  expect(Math.max(...titlePositions.map(p => p.top))).toBeLessThan(Math.min(...titlePositions.map(p => p.bottom)))
  await expect(panel.getByText('Bộ thủ:', { exact: false })).toHaveCount(0)
  expect(await row.evaluate(el => el.getBoundingClientRect().height)).toBeLessThanOrEqual(96)
  await page.setViewportSize({ width: 375, height: 812 })
  await expect(row.getByText('Nǐ', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375)
  await row.scrollIntoViewIfNeeded()
  await page.screenshot({ path: test.info().outputPath('course-pinyin-second-line-mobile.png') })
  const coverage = await page.evaluate(async () => {
    // @ts-expect-error Vite source import for browser checks.
    const { CURRICULUM_LEVELS } = await import('/src/data/curriculum/index.ts')
    const lessons = CURRICULUM_LEVELS.flatMap((l: { lessons: { titlePinyin: string }[] }) => l.lessons)
    return { count: lessons.length, missing: lessons.filter((l: { titlePinyin: string }) => !l.titlePinyin.trim()).length }
  })
  expect(coverage).toEqual({ count: 146, missing: 0 })
})

test('stages open and close with keyboard and respect reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/course')
  const toggle = page.getByRole('button', { name: /Chặng 2 ·/ })
  const panel = page.locator('#stage-panel-hsk2')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(panel).toHaveAttribute('inert', '')
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(panel).not.toHaveAttribute('inert', '')
  await expect(panel).not.toHaveCSS('height', '0px')
  await page.keyboard.press('Space')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(panel).toHaveCSS('height', '0px')
})

test('both stages and supplementary words animate through intermediate heights in both directions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/course')
  await expect(page.locator('#stage-heading-hsk1')).toBeVisible()
  for (const [headingId, panelId] of [
    ['stage-heading-hsk2', 'stage-panel-hsk2'],
    ['supplementary-heading-1', 'supplementary-panel-1'],
  ]) {
    for (const opening of [true, false]) {
      const frames = await page.evaluate(async ({ headingId, panelId }) => {
        const button = document.getElementById(headingId)!
        const panel = document.getElementById(panelId)!
        const fullHeight = panel.firstElementChild!.getBoundingClientRect().height
        const heights: number[] = []
        button.click()
        await new Promise<void>(resolve => {
          const start = performance.now()
          const sample = () => {
            heights.push(panel.getBoundingClientRect().height)
            if (performance.now() - start < 420) requestAnimationFrame(sample)
            else resolve()
          }
          requestAnimationFrame(sample)
        })
        return { heights, fullHeight }
      }, { headingId, panelId })
      expect(frames.heights.filter(h => h > 1 && h < frames.fullHeight - 1).length).toBeGreaterThan(2)
      await expect(page.locator(`#${headingId}`)).toHaveAttribute('aria-expanded', String(opening))
      if (!opening) await expect(page.locator(`#${panelId}`)).toHaveCSS('height', '0px')
    }
  }
})

test('pronunciation tabs have equal wide buttons and consistent content width', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/pronunciation?tab=intro')
    const root = page.getByRole('heading', { name: 'Phát âm', exact: true }).locator('..')
    const expectedWidth = (await root.boundingBox())!.width
    const tabs = root.locator('.grid-flow-col > button')
    const sizes = await tabs.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width))
    expect(new Set(sizes).size).toBe(1)
    expect(sizes[0]).toBeGreaterThanOrEqual(136)
    for (let i = 0; i < sizes.length; i++) {
      await tabs.nth(i).click()
      await expect(tabs.nth(i)).toHaveAttribute('aria-pressed', 'true')
      expect((await root.boundingBox())!.width).toBe(expectedWidth)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    }
    await page.goto('/pronunciation?tab=typing')
    const scope = page.getByLabel('Phạm vi luyện tập')
    await expect(scope).toHaveValue('learned')
    await expect(scope.locator('option[value="all"]')).toHaveText('Mở rộng: từ vựng HSK 1–6 (cả từ chưa học)')
  }
})

test('course progress stays compact and radicals show four items per row', async ({ page }) => {
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/course')
    const progress = page.getByLabel('Tiến độ học tập', { exact: true })
    await expect(progress.getByRole('link', { name: 'Tiếp tục học' })).toBeVisible()
    expect((await progress.boundingBox())!.height).toBeLessThan(200)
    await page.screenshot({ path: test.info().outputPath(`compact-course-${width}.png`) })
    await page.goto('/radicals')
    const grid = page.getByLabel('Danh sách bộ thủ')
    await expect(grid.locator('button').first()).toBeVisible()
    const positions = await grid.locator('button').evaluateAll(nodes => nodes.slice(0, 5).map(node => ({ x: node.getBoundingClientRect().x, y: node.getBoundingClientRect().y })))
    expect(new Set(positions.slice(0, 4).map(p => p.y)).size).toBe(1)
    expect(new Set(positions.slice(0, 4).map(p => p.x)).size).toBe(4)
    expect(positions[4].y).toBeGreaterThan(positions[0].y)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    await grid.scrollIntoViewIfNeeded()
    await page.screenshot({ path: test.info().outputPath(`radicals-four-columns-${width}.png`) })
  }
})
