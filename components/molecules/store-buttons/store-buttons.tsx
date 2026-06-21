import type { StoreLink } from '@/config/ads';

import { Button } from '@/components/atoms/button';

/** アフィリエイトリンクに必須の rel 属性 */
const AFFILIATE_REL = 'sponsored nofollow noopener noreferrer';

interface StoreButtonsProps {
  links: StoreLink[];
}

/**
 * Amazon / 楽天 / Yahoo などのストアリンクをボタン列で表示する共通パーツ。
 * すべて新規タブ + rel="sponsored nofollow" 付き。
 */
export function StoreButtons({ links }: StoreButtonsProps) {
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
          render={<a href={link.href} target="_blank" rel={AFFILIATE_REL} />}
        >
          {link.label}で見る
        </Button>
      ))}
    </div>
  );
}
