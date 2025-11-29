'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/elements/theme-toggle/theme-toggle';

const navigationItems = [
  { href: '/', label: 'home' },
  { href: '/blog', label: 'blog' },
  { href: '/about', label: 'about' },
] as const;

function getLinkClassName(isActive: boolean): string {
  const baseClasses = 'text-base transition-all duration-200 font-mono';
  if (isActive) {
    return `${baseClasses} text-terminal-green dark:text-terminal-green font-bold flex items-center terminal-glow`;
  }
  return `${baseClasses} text-gray-600 dark:text-gray-300 hover:text-terminal-cyan dark:hover:text-terminal-cyan`;
}

export function Header() {
  const pathname = usePathname();
  return (
    <header className="border-b bg-terminal-bg">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold font-mono text-terminal-green dark:text-terminal-green terminal-glow hover:text-terminal-cyan transition-colors duration-200"
        >
          $ blog
        </Link>
        <nav className="flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={getLinkClassName(pathname === item.href)}
            >
              {item.href === pathname && (
                <span className="text-terminal-green dark:text-terminal-green mr-1 text-base font-mono font-bold animate-blink terminal-glow">
                  {'>'}
                </span>
              )}
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
