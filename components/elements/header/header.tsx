'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/elements/theme-toggle/theme-toggle';

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
] as const;

function getLinkClassName(isActive: boolean): string {
  const baseClasses = 'text-base transition-colors duration-200';
  if (isActive) {
    return `${baseClasses} text-primary font-semibold`;
  }
  return `${baseClasses} text-muted-foreground hover:text-foreground`;
}

export function Header() {
  const pathname = usePathname();
  return (
    <header className="border-b bg-background">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-200">
          Blog
        </Link>
        <nav className="flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className={getLinkClassName(pathname === item.href)}>
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
