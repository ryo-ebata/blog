'use client';

import { useEffect, useRef, useState } from 'react';
import { adsConfig, isAdsenseEnabled } from '@/config/ads';
import { cn } from '@/lib/utils';

interface AdUnitProps {
  /** AdSense管理画面で発行したスロットID */
  slot: string;
  /** 広告フォーマット (auto / fluid など) */
  format?: string;
  className?: string;
  /** ファーストビュー外は遅延ロード(既定 true)。FV枠は false で即時ロード。 */
  lazy?: boolean;
  /** CLS 防止のための枠の予約高さ(px)。 */
  minHeight?: number;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** 可視直前に先読みするためのマージン */
const LAZY_ROOT_MARGIN = '200px';
const DEFAULT_MIN_HEIGHT = 280;

/**
 * Google AdSense ディスプレイ広告ユニット。
 * パブリッシャーID/スロットID未設定時は何も描画しない。
 * CLS 防止のため枠の高さを予約し、ファーストビュー外は遅延ロードする。
 */
export function AdUnit({
  slot,
  format = 'auto',
  className,
  lazy = true,
  minHeight = DEFAULT_MIN_HEIGHT,
}: AdUnitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(!lazy);

  /* 遅延ロード: 可視直前に対象化する */
  useEffect(() => {
    if (!isAdsenseEnabled || !slot || shouldLoad) {
      return;
    }
    const element = ref.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: LAZY_ROOT_MARGIN }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [slot, shouldLoad]);

  /* ロード対象になったら広告を push する */
  useEffect(() => {
    if (!isAdsenseEnabled || !slot || !shouldLoad) {
      return;
    }
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      /* AdSenseスクリプト未ロード時は無視 */
    }
  }, [slot, shouldLoad]);

  if (!isAdsenseEnabled || !slot) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-lg bg-muted/40 shadow-xs ring-1 ring-foreground/10',
        className
      )}
      style={{ minHeight }}
    >
      {/* 広告枠であることを示すラベル */}
      <span className="block px-3 pt-2 text-xs text-muted-foreground">広告</span>
      {shouldLoad && (
        <ins
          className="adsbygoogle block px-3 pb-3"
          style={{ display: 'block' }}
          data-ad-client={adsConfig.adsense.clientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
