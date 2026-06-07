'use client';

import { bannerAds } from '@/config/ads';

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
      className="not-prose my-6 flex justify-center"
      suppressHydrationWarning
      /* oxlint-disable-next-line: ASPが発行する広告タグをそのまま埋め込むため必要 */
      dangerouslySetInnerHTML={{ __html: banner.html }}
    />
  );
}
