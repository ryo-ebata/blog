import { AffiliateCard } from '@/components/molecules/affiliate-card/affiliate-card';
import { AffiliateDisclosure } from '@/components/molecules/affiliate-disclosure/affiliate-disclosure';
import { Separator } from '@/components/atoms/separator';
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-foreground">{heading}</h2>
        <AffiliateDisclosure />
      </div>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recommendedItems.map((item) => (
          <AffiliateCard key={item.id} item={item} />
        ))}
      </div>
    </aside>
  );
}
