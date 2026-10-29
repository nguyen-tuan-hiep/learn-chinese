import { test, expect } from '@playwright/test'

test('new branding and vector images render on mobile, desktop and dark mode', async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await expect(page).toHaveTitle('Tự học Hànyǔ · Học tiếng Trung')
    const brand = page.getByText('Tự học Hànyǔ', { exact: true })
    await expect(brand.filter({ visible: true })).toHaveCount(1)
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/logo.svg')
    await expect(page.locator('img[src$="logo.svg"]').filter({ visible: true })).toBeVisible()
    expect(await page.locator('img[src$="logo.svg"]').first().evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    if (width > 1024) {
      await expect(page.locator('img[src$="learning-journey.svg"]')).toBeVisible()
      expect(await page.locator('img[src$="learning-journey.svg"]').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    await page.screenshot({ path: test.info().outputPath(`branding-${width}.png`), fullPage: true })
  }
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await expect(page.getByRole('region', { name: 'Khám phá các phần học' }).getByRole('link').first()).toHaveCSS('background-color', 'rgb(23, 34, 36)')
  await page.screenshot({ path: test.info().outputPath('branding-dark.png'), fullPage: true })
})

test('dark theme uses slate surfaces and readable mint actions, persists and switches back', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/stats#settings')
  await page.getByRole('button', { name: 'Tối', exact: true }).click()
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(16, 24, 25)')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
  await page.reload()
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(16, 24, 25)')
  await page.goto('/')
  const action = page.getByRole('link', { name: 'Bắt đầu học', exact: false })
  await expect(action).toHaveCSS('background-color', 'rgb(103, 215, 178)')
  await expect(action).toHaveCSS('color', 'rgb(16, 24, 25)')
  const contrast = await action.evaluate(el => {
    const luminance = (color: string) => {
      const rgb = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(v => v / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
    }
    const style = getComputedStyle(el)
    const fg = luminance(style.color), bg = luminance(style.backgroundColor)
    return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05)
  })
  expect(contrast).toBeGreaterThanOrEqual(4.5)
  const card = page.getByRole('region', { name: 'Khám phá các phần học' }).getByRole('link').first()
  await expect(card).toHaveCSS('background-color', 'rgb(23, 34, 36)')
  await page.screenshot({ path: test.info().outputPath('slate-dark-desktop.png'), fullPage: true })
  await page.setViewportSize({ width: 375, height: 900 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375)
  await page.screenshot({ path: test.info().outputPath('slate-dark-mobile.png'), fullPage: true })
  await page.goto('/stats#settings')
  await page.getByRole('button', { name: 'Sáng', exact: true }).click()
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(250, 247, 242)')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light')
})
