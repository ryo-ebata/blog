'use client';

import { IconBrandX } from '@tabler/icons-react';
import { Bookmark, Check, Link2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/atoms/button';
import { siteConfig } from '@/config/site';

const COPY_FEEDBACK_MS = 2000;

const getXShareUrl = (url: string, title: string): string => {
  const via = siteConfig.links.twitter.split('/').pop() ?? '';
  const params = new URLSearchParams({ text: title, url });
  if (via) {
    params.set('via', via);
  }
  return `https://twitter.com/intent/tweet?${params.toString()}`;
};

const getHatenaUrl = (url: string): string =>
  `https://b.hatena.ne.jp/entry/s/${url.replace(/^https?:\/\//, '')}`;

export const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    } catch {
      /* クリップボード非対応/権限拒否時は何もしない */
    }
  };

  return (
    <div className="not-prose flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">シェア:</span>
      <Button
        variant="outline"
        size="sm"
        render={<a href={getXShareUrl(url, title)} target="_blank" rel="noopener noreferrer" />}
      >
        <IconBrandX className="size-4" />X
      </Button>
      <Button
        variant="outline"
        size="sm"
        render={<a href={getHatenaUrl(url)} target="_blank" rel="noopener noreferrer" />}
      >
        <Bookmark className="size-4" />
        はてブ
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        {copied ? 'コピーしました' : 'リンクをコピー'}
      </Button>
    </div>
  );
};
