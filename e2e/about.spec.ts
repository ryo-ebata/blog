import { expect, test } from '@playwright/test';

test.describe('About Page', () => {
  test('should display the about page', async ({ page }) => {
    await page.goto('/about');

    // ページが正しく読み込まれることを確認
    await expect(page).toHaveURL('/about');

    // メインコンテンツが表示されることを確認
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have proper page structure', async ({ page }) => {
    await page.goto('/about');

    // ヘッダーとフッターが存在することを確認
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});
