'use client';

import Link from 'next/link';

interface BackLinkProps {
  href: string;
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <div className="mb-6">
      <Link
        href={href}
        className="terminal-glow text-terminal-cyan dark:text-terminal-cyan hover:text-terminal-green dark:hover:text-terminal-green underline transition-colors duration-200 font-mono"
      >
        {label}
      </Link>
    </div>
  );
}
