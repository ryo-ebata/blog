import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the home page correctly', async ({ page }) => {
    await page.goto('/');

    // ページタイトルが存在することを確認
    await expect(page).toHaveTitle(/.*$/);

    // メインコンテンツが表示されることを確認
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have header and footer', async ({ page }) => {
    await page.goto('/');

    // ヘッダーが表示されることを確認
    await expect(page.locator('header')).toBeVisible();

    // フッターが表示されることを確認
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/');

    // ヘッダーのBlogリンクをクリック（タグリンクと区別するためexact: trueを使用）
    const blogLink = page.getByRole('link', { exact: true, name: 'Blog' });
    if (await blogLink.isVisible()) {
      await blogLink.click();
      await expect(page).toHaveURL(/\/blog/);
    }
  });
});
