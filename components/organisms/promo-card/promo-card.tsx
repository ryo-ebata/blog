import { AdUnit } from '@/components/molecules/ad-unit/ad-unit';
import { AffiliateCard } from '@/components/molecules/affiliate-card/affiliate-card';
import { adsConfig, isAdsenseEnabled, recommendedItems } from '@/config/ads';

interface PromoCardProps {
  /** 表示する商品をローテーションするためのインデックス */
  seed?: number;
}

/**
 * 記事一覧グリッドのカード間に差し込む広告セル。
 * AdSenseが有効ならインフィード広告、無ければおすすめ商品を1件表示する。
 * どちらも未設定なら何も描画しない（グリッドは詰まる）。
 */
export function PromoCard({ seed = 0 }: PromoCardProps) {
  if (isAdsenseEnabled && adsConfig.adsense.slots.listInFeed) {
    return (
      <div className="article-card flex items-center justify-center p-5">
        <AdUnit slot={adsConfig.adsense.slots.listInFeed} format="fluid" className="w-full" />
      </div>
    );
  }

  if (recommendedItems.length > 0) {
    const item = recommendedItems[seed % recommendedItems.length];
    return <AffiliateCard item={item} />;
  }

  return null;
}
