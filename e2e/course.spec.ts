import { test, expect } from '@playwright/test'

test('the textbook path can skip and restore a lesson with persistent progress', async ({ page }) => {
  await page.goto('/course')
  const current = page.getByLabel('Tiến độ học tập').getByRole('link', { name: 'Tiếp tục học' })
  await expect(current).toHaveAttribute('href', '/lesson/hsk1-01?part=pronunciation')
  await expect(page.getByText(/Chặng 0/)).toHaveCount(0)
  await expect(page.getByRole('button', { name: /Chặng [1-6] ·/ })).toHaveCount(6)
  const stage = page.locator('#stage-panel-hsk1')
  await expect(stage.locator('li').first().getByText('Nǐ', { exact: true })).toHaveClass(/text-tone3/)
  await page.getByRole('button', { name: 'Bỏ qua HSK 1 · Bài 1', exact: true }).click()
  await expect(current).toHaveAttribute('href', '/lesson/hsk1-02?part=pronunciation')
  await page.reload()
  await expect(page.getByRole('button', { name: 'Hoàn tác bỏ qua HSK 1 · Bài 1', exact: true })).toBeVisible()
  await expect(page.getByLabel('Tiến độ học tập').getByText(/1 bài bỏ qua/)).toBeVisible()
  await page.getByRole('button', { name: 'Hoàn tác bỏ qua HSK 1 · Bài 1', exact: true }).click()
  await expect(current).toHaveAttribute('href', '/lesson/hsk1-01?part=pronunciation')
})
