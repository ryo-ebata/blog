import { Badge } from '@/components/atoms/badge';
import { StoreButtons } from '@/components/molecules/store-buttons/store-buttons';
import type { AffiliateItem } from '@/config/ads';
import { resolveStoreLinks } from '@/config/ads';

/**
 * おすすめ商品1件のアフィリエイトカード（config の recommendedItems 用）。
 * 有効なストアリンクが1つも無い場合は描画しない。
 */
export function AffiliateCard({ item }: { item: AffiliateItem }) {
  const links = resolveStoreLinks({
    name: item.title,
    amazonAsin: item.amazonAsin,
    rakutenUrl: item.rakutenUrl,
    yahooUrl: item.yahooUrl,
    moshimoUrl: item.moshimoUrl,
  });
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="not-prose article-card flex flex-col">
      <div className="flex gap-4 p-4">
        {item.imageUrl && (
          // 外部の任意ドメイン画像のため next/image ではなく img を使用
          // oxlint-disable-next-line
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className="size-20 shrink-0 rounded-lg bg-muted object-contain ring-1 ring-foreground/10"
          />
        )}
        <div className="min-w-0 flex-1">
          <Badge variant="outline" className="mb-1.5 h-4 px-1.5 text-[10px]">
            PR
          </Badge>
          <p className="line-clamp-2 text-sm font-semibold text-card-foreground">{item.title}</p>
          {item.price && (
            <p className="mt-1 text-sm font-bold text-foreground tabular-nums">{item.price}</p>
          )}
          {item.description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
          )}
        </div>
      </div>
      <div className="mt-auto px-4 pb-4">
        <StoreButtons links={links} />
      </div>
    </div>
  );
}
