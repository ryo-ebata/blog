'use client';

import { useEffect, useRef } from 'react';
import { Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

const BMC_SCRIPT_SRC = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';

const BMC_SCRIPT_ATTRIBUTES = {
  'data-color': '#FFDD00',
  'data-coffee-color': '#ffffff',
  'data-emoji': '☕',
  'data-font': 'Arial',
  'data-font-color': '#000000',
  'data-name': 'bmc-button',
  'data-outline-color': '#000000',
  'data-slug': 'ryoebata',
  'data-text': 'Buy me a coffee',
} as const;

/**
 * Buy Me A Coffee のウィジェットスクリプトを埋め込む
 * @see https://buymeacoffee.com/
 *
 * 公式のscriptタグをそのままdangerouslySetInnerHTMLで挿入すると、
 * innerHTML経由で追加されたscript要素はブラウザの仕様上実行されないため、
 * DOM APIでscript要素を生成してマウントする
 */
const useBmcWidget = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const script = document.createElement('script');
    script.src = BMC_SCRIPT_SRC;
    script.async = true;
    for (const [name, value] of Object.entries(BMC_SCRIPT_ATTRIBUTES)) {
      script.setAttribute(name, value);
    }
    container.appendChild(script);

    return () => {
      container.removeChild(script);
    };
  }, [containerRef]);
};

export const BuyMeACoffee = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useBmcWidget(containerRef);

  return (
    <div
      className={cn(
        'mt-12 flex flex-col items-center gap-4 rounded-xl bg-card p-6 text-center text-card-foreground shadow-xs ring-1 ring-foreground/10'
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Coffee className="size-4" aria-hidden="true" />
        <span className="text-sm font-medium">コーヒーで応援する</span>
      </div>
      <div ref={containerRef} />
    </div>
  );
};
