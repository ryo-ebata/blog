'use client';

import { ArrowLeft } from 'lucide-react';
import { Link } from 'next-view-transitions';

import { cn } from '@/lib/utils';

interface BackLinkProps {
  href: string;
  label: string;
}

export const BackLink = ({ href, label }: BackLinkProps) => (
  <div className="mb-6">
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1 rounded-md text-sm font-medium text-muted-foreground transition-colors',
        'hover:text-foreground',
        'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'
      )}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  </div>
);
