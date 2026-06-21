import { AdUnit } from '@/components/molecules/ad-unit/ad-unit';
import { BannerAd } from '@/components/molecules/banner-ad/banner-ad';
import { AffiliateRecommend } from '@/components/organisms/affiliate-recommend/affiliate-recommend';
import { adsConfig } from '@/config/ads';

interface PromoBlockProps {
  placement: 'article-top' | 'article-bottom';
}

/**
 * 記事本文の前後に挿入する広告ブロック。
 * - article-top: AdSenseのみ（読み始めの邪魔をしない）
 * - article-bottom: AdSense + おすすめ商品 + バナー（読了後にまとめて）
 * 各要素は未設定なら自動的に非表示。
 */
export function PromoBlock({ placement }: PromoBlockProps) {
  if (placement === 'article-top') {
    return (
      <div className="not-prose my-6">
        {/* 記事冒頭はファーストビュー寄りのため即時ロード */}
        <AdUnit slot={adsConfig.adsense.slots.articleTop} lazy={false} />
      </div>
    );
  }

  return (
    <div className="not-prose my-6 flex flex-col gap-6">
      <AdUnit slot={adsConfig.adsense.slots.articleBottom} />
      <AffiliateRecommend />
      <BannerAd />
    </div>
  );
}
