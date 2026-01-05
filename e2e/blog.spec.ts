import { expect, test } from '@playwright/test';

test.describe('Blog Page', () => {
  test('should display the blog list page', async ({ page }) => {
    await page.goto('/blog');

    // ページが正しく読み込まれることを確認
    await expect(page).toHaveURL('/blog');

    // メインコンテンツが表示されることを確認
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/blog');

    // ヘッダーナビゲーションが存在することを確認
    await expect(page.locator('header')).toBeVisible();
  });

  test('should be accessible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/blog');

    // モバイルでもメインコンテンツが表示されることを確認
    await expect(page.locator('main')).toBeVisible();
  });
});
