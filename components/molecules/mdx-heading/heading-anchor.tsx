'use client';

import { useState } from 'react';
import { Check, Link as LinkIcon } from 'lucide-react';

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
    <button
      aria-label={getAriaLabel(copied)}
      className="mdx-heading-anchor"
      onClick={handleClick}
      type="button"
    >
      {copied && <Check className="h-4 w-4 text-green-500" />}
      {!copied && <LinkIcon className="h-4 w-4" />}
    </button>
  );
};
