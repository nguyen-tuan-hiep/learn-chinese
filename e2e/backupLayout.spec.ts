import { test, expect } from '@playwright/test'

test('backup actions align, long filenames fit and restore preview works on mobile and desktop', async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/stats#settings')
    await page.getByRole('button', { name: 'Tối', exact: true }).click()
    const backup = page.locator('[aria-labelledby="study-backup-title"]')
    const download = backup.getByRole('button', { name: 'Tải bản sao lưu', exact: true })
    const choose = backup.getByRole('button', { name: 'Chọn tệp sao lưu', exact: true })
    await expect(download).toBeVisible()
    const downBox = (await download.boundingBox())!, chooseBox = (await choose.boundingBox())!
    if (width > 768) expect(downBox.y).toBe(chooseBox.y)
    else { expect(chooseBox.y).toBeGreaterThan(downBox.y); expect(chooseBox.width).toBe(downBox.width) }
    const [file] = await Promise.all([page.waitForEvent('download'), download.click()])
    expect(file.suggestedFilename()).toMatch(/\.json$/)
    const data = await page.evaluate(async () => {
      // @ts-expect-error Vite source modules for browser testing.
      const { exportBackup } = await import('/src/lib/backup.ts')
      return JSON.stringify(await exportBackup())
    })
    const payload = { name: `${'ban-sao-tien-do-'.repeat(15)}.json`, mimeType: 'application/json', buffer: Buffer.from(data) }
    await backup.getByLabel('Chọn tệp để khôi phục').setInputFiles(payload)
    await expect(backup.getByRole('heading', { name: 'Xem trước bản sao', exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    await backup.screenshot({ path: test.info().outputPath(`backup-dark-${width}.png`) })
    await backup.getByRole('button', { name: 'Hủy', exact: true }).click()
    await expect(backup.getByRole('heading', { name: 'Xem trước bản sao', exact: true })).toHaveCount(0)
    await backup.getByLabel('Chọn tệp để khôi phục').setInputFiles(payload)
    await backup.getByRole('button', { name: 'Xác nhận thay thế và khôi phục', exact: true }).click()
    await expect(backup.getByRole('status')).toHaveText(/Đã khôi phục tiến độ/)
    await page.getByRole('button', { name: 'Sáng', exact: true }).click()
    await backup.screenshot({ path: test.info().outputPath(`backup-light-${width}.png`) })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  }
})
