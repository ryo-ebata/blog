interface AffiliateClickParams {
  store: string;
  product?: string;
  placement?: string;
}

type GtagFn = (command: 'event', eventName: string, params?: Record<string, unknown>) => void;

/**
 * アフィリエイトリンクのクリックを GA4 の affiliate_click カスタムイベントとして送信する。
 * gtag 未ロード時(GA4 未導入)は no-op になり、導入後に自動で計測が始まる。
 */
export const trackAffiliateClick = ({ store, product, placement }: AffiliateClickParams): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const gtag = (window as unknown as { gtag?: GtagFn }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', 'affiliate_click', { store, product, placement });
  }
};
