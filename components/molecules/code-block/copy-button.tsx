'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/atoms/button';
import { cn } from '@/lib/utils';

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
      className={cn(
        'absolute right-2 top-2 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100',
        copied && 'text-success'
      )}
      onClick={handleCopy}
      size="icon-sm"
      variant="ghost"
    >
      {copied && <Check className="size-4" />}
      {!copied && <Copy className="size-4" />}
    </Button>
  );
};
