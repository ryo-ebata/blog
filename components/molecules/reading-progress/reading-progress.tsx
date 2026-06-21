'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  /** 進捗の基準にする要素のセレクタ(既定: 記事本文 article)。 */
  targetSelector?: string;
}

/**
 * ページ上部固定の読書進捗バー。基準要素(記事本文)のスクロール量で 0→100% に変化する。
 * prefers-reduced-motion 時は非表示(motion-reduce:hidden)。
 */
export const ReadingProgress = ({ targetSelector = 'article' }: ReadingProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(targetSelector);
    if (!target) {
      return;
    }

    const update = () => {
      const start = target.offsetTop;
      const end = start + target.offsetHeight - window.innerHeight;
      const total = end - start;
      const value = total <= 0 ? 1 : (window.scrollY - start) / total;
      setProgress(Math.min(1, Math.max(0, value)));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [targetSelector]);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-1 motion-reduce:hidden">
      <div
        className="h-full bg-primary transition-[width] duration-75 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
};
