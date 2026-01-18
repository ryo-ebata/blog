'use client';

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
    suppressHydrationWarning
    /* Biome-ignore lint/security/noDangerouslySetInnerHtml: Buy Me a Coffee の公式スクリプト（document.write を使用するため必要） */
    dangerouslySetInnerHTML={{
      __html: `<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="ryoebata" data-color="#FFDD00" data-emoji="☕" data-font="Arial" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff"></script>`,
    }}
  />
);
