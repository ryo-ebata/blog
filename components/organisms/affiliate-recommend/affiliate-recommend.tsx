import { AffiliateCard } from '@/components/molecules/affiliate-card/affiliate-card';
import { recommendedItems } from '@/config/ads';

interface AffiliateRecommendProps {
  heading?: string;
}

/**
 * おすすめ商品（アフィリエイト）のセクション。
 * config/ads.ts の recommendedItems が空の間は非表示。
 */
export function AffiliateRecommend({ heading = 'この記事のおすすめ' }: AffiliateRecommendProps) {
  if (recommendedItems.length === 0) {
    return null;
  }

  return (
    <aside className="not-prose my-8">
      <p className="mb-3 text-sm font-medium text-muted-foreground">{heading}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recommendedItems.map((item) => (
          <AffiliateCard key={item.id} item={item} />
        ))}
      </div>
    </aside>
  );
}
