'use client';

import Script from 'next/script';

interface BuyMeACoffeeProps {
  slug?: string;
  color?: string;
  emoji?: string;
  font?: string;
  text?: string;
  outlineColor?: string;
  fontColor?: string;
  coffeeColor?: string;
}

export function BuyMeACoffee({
  slug = 'ryoebata',
  color = '#FFDD00',
  emoji = '☕',
  font = 'Arial',
  text = 'Buy me a coffee',
  outlineColor = '#000000',
  fontColor = '#000000',
  coffeeColor = '#ffffff',
}: BuyMeACoffeeProps = {}) {
  return (
    <Script
      src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
      data-name="bmc-button"
      data-slug={slug}
      data-color={color}
      data-emoji={emoji}
      data-font={font}
      data-text={text}
      data-outline-color={outlineColor}
      data-font-color={fontColor}
      data-coffee-color={coffeeColor}
      strategy="afterInteractive"
    />
  );
}
