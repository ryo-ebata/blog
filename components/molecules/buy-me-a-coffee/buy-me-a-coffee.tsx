'use client';

import { Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Buy Me A Coffee Button
 * @see https://buymeacoffee.com/
 *
 * <script
 *  type="text/javascript"
 *  src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
 *  data-name="bmc-button"
 *  data-slug="ryoebata"
 *  data-color="#FFDD00"
 *  data-emoji="☕"
 *  data-font="Arial"
 *  data-text="Buy me a coffee"
 *  data-outline-color="#000000"
 *  data-font-color="#000000"
 *  data-coffee-color="#ffffff"
 * ></script>
 */
export const BuyMeACoffee = () => (
  <div
    className={cn(
      'mt-12 flex flex-col items-center gap-4 rounded-xl bg-card p-6 text-center text-card-foreground shadow-xs ring-1 ring-foreground/10'
    )}
  >
    <div className="flex items-center gap-2 text-muted-foreground">
      <Coffee className="size-4" aria-hidden="true" />
      <span className="text-sm font-medium">コーヒーで応援する</span>
    </div>
    <div
      suppressHydrationWarning
      /* Biome-ignore lint/security/noDangerouslySetInnerHtml: Buy Me a Coffee の公式スクリプト（document.write を使用するため必要） */
      dangerouslySetInnerHTML={{
        __html: `<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="ryoebata" data-color="#FFDD00" data-emoji="☕" data-font="Arial" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff"></script>`,
      }}
    />
  </div>
);
