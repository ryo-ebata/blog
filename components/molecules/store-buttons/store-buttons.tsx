'use client';

import type { StoreLink } from '@/config/ads';

import { Button } from '@/components/atoms/button';
import { trackAffiliateClick } from '@/lib/analytics';

/** アフィリエイトリンクに必須の rel 属性 */
const AFFILIATE_REL = 'sponsored nofollow noopener noreferrer';

interface StoreButtonsProps {
  links: StoreLink[];
  /** 計測用の商品名(GA4 affiliate_click の product) */
  productName?: string;
  /** 計測用の配置(GA4 affiliate_click の placement) */
  placement?: string;
}

/**
 * Amazon / 楽天 / Yahoo などのストアリンクをボタン列で表示する共通パーツ。
 * すべて新規タブ + rel="sponsored nofollow" 付き。クリックを GA4 に計測する。
 */
export function StoreButtons({ links, productName, placement }: StoreButtonsProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Button
          key={link.store}
          variant="secondary"
          size="sm"
          onClick={() =>
            trackAffiliateClick({ store: link.store, product: productName, placement })
          }
          render={<a href={link.href} target="_blank" rel={AFFILIATE_REL} />}
        >
          {link.label}で見る
        </Button>
      ))}
    </div>
  );
}
