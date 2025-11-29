'use client';

import Link from 'next/link';

type BackLinkProps = {
  href?: string;
  label?: string;
};

export function BackLink({ href = '/blog', label = '← ブログ一覧に戻る' }: BackLinkProps) {
  return (
    <div className="mb-6">
      <Link
        href={href}
        className="text-terminal-cyan dark:text-terminal-cyan hover:text-terminal-green dark:hover:text-terminal-green underline transition-colors duration-200 font-mono"
      >
        $ cd {label}
      </Link>
    </div>
  );
}
