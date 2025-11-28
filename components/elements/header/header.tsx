'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/elements/theme-toggle/theme-toggle';

const navigationItems = [
  { href: '/', label: 'home' },
  { href: '/blog', label: 'blog' },
] as const;

function getLinkClassName(isActive: boolean): string {
  const baseClasses = 'text-base transition-colors duration-200';
  if (isActive) {
    return `${baseClasses} text-gray-900 dark:text-gray-100 font-bold underline`;
  }
  return `${baseClasses} text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100`;
}

export function Header() {
  const pathname = usePathname();
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          ブログ
        </Link>
        <nav className="flex items-center gap-4">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={getLinkClassName(pathname === item.href)}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
