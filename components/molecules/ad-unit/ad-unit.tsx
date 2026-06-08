'use client';

import { useEffect } from 'react';
import { adsConfig, isAdsenseEnabled } from '@/config/ads';

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
    <ins
      className={`adsbygoogle ${className ?? ''}`}
      style={{ display: 'block' }}
      data-ad-client={adsConfig.adsense.clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
