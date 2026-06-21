'use client';

import { useReportWebVitals } from 'next/web-vitals';

import { reportWebVital } from '@/lib/analytics';

/**
 * 実ユーザー環境の Core Web Vitals(LCP/INP/CLS/FCP/TTFB)を計測する RUM コンポーネント。
 * Next.js 標準の useReportWebVitals を使い、収集値は analytics(gtag)へ束ねる。
 * gtag 未導入時は外部送信されない。
 */
export const WebVitals = () => {
  useReportWebVitals((metric) => {
    reportWebVital({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  });
  return null;
};
