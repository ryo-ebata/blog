import type { Locator } from '@playwright/test';
import { expect, test } from '@playwright/test';

const MIN_CARD_COUNT = 2;

const getViewTransitionStyle = (card: Locator) =>
  card.evaluate((el) => {
    const styled = el.querySelector<HTMLElement>('[style*="view-transition-name"]');
    return styled?.style.viewTransitionName ?? null;
  });

/* 戻る遷移直後、ArticleCardのview-transition-name反映(useSyncExternalStore経由の
   sessionStorage再評価)がDOM更新に間に合わず一瞬nullを返すことがあるため、
   期待値に落ち着くまでポーリングして待つ。 */
const expectEyecatchTransitionName = async (card: Locator) => {
  await expect(async () => {
    expect(await getViewTransitionStyle(card)).toContain('eyecatch-');
  }).toPass();
};

const expectNoTransitionName = async (card: Locator) => {
  await expect(async () => {
    expect(await getViewTransitionStyle(card)).toBeNull();
  }).toPass();
};

test.describe('Blog navigation (Cache Components / Instant Navigations)', () => {
  test('戻る遷移で直前に見ていた記事のカードだけがView Transitionのモーフィング対象になる', async ({
    page,
  }) => {
    await page.goto('/blog');

    const cards = page.locator('.article-card');
    const cardCount = await cards.count();
    test.skip(cardCount < MIN_CARD_COUNT, '記事が2件未満のため検証をスキップ');

    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);

    /* 1件目の記事へ遷移して戻る */
    await firstCard.getByRole('link').first().click();
    await page.waitForURL(/\/blog\/.+/);
    await page.goBack();
    await page.waitForURL('/blog');

    await expectEyecatchTransitionName(firstCard);
    await expectNoTransitionName(secondCard);

    /* 続けて2件目の記事へ遷移して戻る。Activityによるルート状態保持下でも、
       1件目のカードに残っていたモーフィング対象指定が2件目に正しく
       引き継がれる(1件目には残らない)ことを確認する。 */
    await secondCard.getByRole('link').first().click();
    await page.waitForURL(/\/blog\/.+/);
    await page.goBack();
    await page.waitForURL('/blog');

    await expectEyecatchTransitionName(secondCard);
    await expectNoTransitionName(firstCard);
  });
});
