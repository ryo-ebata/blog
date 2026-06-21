'use client';

import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
] as const;

const getLinkClassName = (isActive: boolean): string =>
  cn(
    'whitespace-nowrap text-sm transition-colors',
    isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
  );

interface NavLinkProps {
  href: string;
  isActive: boolean;
  label: string;
}

const NavLink = ({ href, isActive, label }: NavLinkProps) => (
  <Link href={href} className={getLinkClassName(isActive)}>
    {label}
  </Link>
);

interface NavigationProps {
  pathname: string;
}

const Navigation = ({ pathname }: NavigationProps) => (
  <nav className="flex shrink-0 items-center gap-3 sm:gap-6">
    {navigationItems.map((item) => (
      <NavLink
        key={item.href}
        href={item.href}
        isActive={pathname === item.href}
        label={item.label}
      />
    ))}
    <ThemeToggle />
  </nav>
);

const SiteLogo = () => (
  <Link
    href="/"
    className="shrink-0 whitespace-nowrap text-lg font-bold text-foreground transition-colors hover:text-primary sm:text-xl"
  >
    {siteConfig.name}
  </Link>
);

export const Header = () => {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur ring-1 ring-foreground/10">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4">
        <SiteLogo />
        <Navigation pathname={pathname} />
      </div>
    </header>
  );
};
