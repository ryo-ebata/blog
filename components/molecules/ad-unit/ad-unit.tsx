'use client';

import { useEffect } from 'react';
import { adsConfig, isAdsenseEnabled } from '@/config/ads';
import { cn } from '@/lib/utils';

interface AdUnitProps {
  /** AdSense管理画面で発行したスロットID */
  slot: string;
  /** 広告フォーマット (auto / fluid など) */
  format?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Google AdSense ディスプレイ広告ユニット。
 * パブリッシャーIDまたはスロットIDが未設定の場合は何も描画しない。
 */
export function AdUnit({ slot, format = 'auto', className }: AdUnitProps) {
  useEffect(() => {
    if (!isAdsenseEnabled || !slot) {
      return;
    }
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      /* AdSenseスクリプト未ロード時は無視 */
    }
  }, [slot]);

  if (!isAdsenseEnabled || !slot) {
    return null;
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg bg-muted/40 shadow-xs ring-1 ring-foreground/10',
        className
      )}
    >
      {/* 広告枠であることを示すラベル */}
      <span className="block px-3 pt-2 text-xs text-muted-foreground">広告</span>
      <ins
        className="adsbygoogle block px-3 pb-3"
        style={{ display: 'block' }}
        data-ad-client={adsConfig.adsense.clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
