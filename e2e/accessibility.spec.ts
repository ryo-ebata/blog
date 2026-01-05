import { expect, test } from '@playwright/test';

test.describe('Accessibility', () => {
  const pages = ['/', '/blog', '/about'];

  for (const path of pages) {
    test(`should have lang attribute on ${path}`, async ({ page }) => {
      await page.goto(path);

      // html要素にlang属性があることを確認
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBe('ja');
    });

    test(`should have no duplicate IDs on ${path}`, async ({ page }) => {
      await page.goto(path);

      // 重複したIDがないことを確認
      const ids = await page.evaluate(() => {
        const elements = document.querySelectorAll('[id]');
        const idList: string[] = [];
        for (const el of elements) {
          idList.push(el.id);
        }
        return idList;
      });

      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  }

  test('should support keyboard navigation on home', async ({ page }) => {
    await page.goto('/');

    // Tabキーでフォーカスが移動することを確認
    await page.keyboard.press('Tab');

    // フォーカスが何かの要素に当たっていることを確認
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});
