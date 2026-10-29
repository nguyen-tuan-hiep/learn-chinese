import { test, expect } from '@playwright/test'

test('the course is one ordered path of lessons that can be skipped and restored', async ({ page }) => {
  await page.goto('/course')
  await expect(page.getByRole('link', { name: /Tiếp tục:\s*Nhập môn · Buổi 1/ })).toBeVisible()
  await page.getByRole('button', { name: 'Bỏ qua cả nhập môn' }).click()
  await expect(page.getByRole('link', { name: /Tiếp tục:\s*HSK 1 · Bài 1 你好 · Chữ & bộ thủ/ })).toBeVisible()
  await expect(page.getByText('Sắp tới: HSK 1 · Bài 2 → HSK 1 · Bài 3', { exact: false })).toBeVisible()
  await expect(page.getByText('Bộ thủ', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Bộ mới:', { exact: false }).first()).toBeVisible()

  await page.getByRole('button', { name: 'Bỏ qua HSK 1 · Bài 1', exact: true }).click()
  await expect(page.getByRole('link', { name: /Tiếp tục:\s*HSK 1 · Bài 2/ })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Hoàn tác bỏ qua HSK 1 · Bài 1', exact: true })).toBeVisible()
  await expect(page.getByRole('definition').filter({ hasText: 'bỏ qua 1' }).last()).toBeVisible()
  await page.getByRole('button', { name: 'Hoàn tác bỏ qua HSK 1 · Bài 1', exact: true }).click()
  await expect(page.getByRole('link', { name: /Tiếp tục:\s*HSK 1 · Bài 1/ })).toBeVisible()
})
