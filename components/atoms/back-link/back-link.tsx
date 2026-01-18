'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BackLinkProps {
  href: string;
  label: string;
}

export const BackLink = ({ href, label }: BackLinkProps) => (
  <div className="mb-6">
    <Link
      href={href}
      className="text-primary hover:text-primary/80 transition-colors duration-200 inline-flex items-center gap-1"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  </div>
);
