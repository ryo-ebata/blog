'use client';

import { useState } from 'react';
import { Check, Link as LinkIcon } from 'lucide-react';

import { Button } from '@/components/atoms/button';

const COPY_FEEDBACK_DURATION_MS = 2000;

interface HeadingAnchorProps {
  id: string;
}

const getAriaLabel = (copied: boolean): string => {
  if (copied) {
    return 'リンクをコピーしました';
  }
  return '見出しリンクをコピー';
};

export const HeadingAnchor = ({ id }: HeadingAnchorProps): React.ReactElement => {
  const [copied, setCopied] = useState(false);

  const handleClick = async (): Promise<void> => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS);
  };

  return (
    <Button
      aria-label={getAriaLabel(copied)}
      className="mdx-heading-anchor size-6 text-muted-foreground opacity-0 transition-opacity hover:text-primary"
      onClick={handleClick}
      size="icon-xs"
      type="button"
      variant="ghost"
    >
      {copied && <Check className="size-4 text-success" />}
      {!copied && <LinkIcon className="size-4" />}
    </Button>
  );
};
