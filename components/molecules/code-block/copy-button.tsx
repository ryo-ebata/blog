'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/atoms/button';

const COPY_FEEDBACK_DURATION_MS = 2000;

interface CopyButtonProps {
  code: string;
}

const getAriaLabel = (copied: boolean): string => {
  if (copied) {
    return 'コピーしました';
  }
  return 'コードをコピー';
};

export const CopyButton = ({ code }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS);
  };

  return (
    <Button
      aria-label={getAriaLabel(copied)}
      className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
      onClick={handleCopy}
      size="icon"
      variant="ghost"
    >
      {copied && <Check className="h-4 w-4" />}
      {!copied && <Copy className="h-4 w-4" />}
    </Button>
  );
};
