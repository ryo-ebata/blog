'use client';

import { Badge } from '@/components/atoms/badge';
import { bannerAds } from '@/config/ads';
import { cn } from '@/lib/utils';

interface BannerAdProps {
  /** bannerAds 配列のインデックス */
  index?: number;
}

/**
 * A8.netなどASPが発行したバナー広告（HTMLタグ）を表示する。
 * 該当インデックスのバナーが無ければ何も描画しない。
 */
export function BannerAd({ index = 0 }: BannerAdProps) {
  const banner = bannerAds[index];
  if (!banner) {
    return null;
  }

  return (
    <div
      className={cn('not-prose my-6 rounded-xl bg-card p-4 shadow-xs ring-1 ring-foreground/10')}
    >
      <div className="mb-2 flex justify-center">
        <Badge variant="outline">広告</Badge>
      </div>
      <div
        className="flex justify-center"
        suppressHydrationWarning
        /* oxlint-disable-next-line: ASPが発行する広告タグをそのまま埋め込むため必要 */
        dangerouslySetInnerHTML={{ __html: banner.html }}
      />
    </div>
  );
}
