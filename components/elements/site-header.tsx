'use client';

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          ブログ
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/blog"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            記事一覧
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
