import type { StoreLink } from '@/config/ads';

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
        <a
          key={link.store}
          href={link.href}
          target="_blank"
          rel={AFFILIATE_REL}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {link.label}で見る
        </a>
      ))}
    </div>
  );
}
