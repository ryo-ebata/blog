'use client';

import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle';
import { siteConfig } from '@/config/site';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
] as const;

const getLinkClassName = (isActive: boolean): string => {
  const baseClasses = 'text-base transition-colors duration-200';
  if (isActive) {
    return `${baseClasses} text-primary font-semibold`;
  }
  return `${baseClasses} text-muted-foreground hover:text-foreground`;
};

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
  <nav className="flex items-center gap-6">
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
    className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-200"
  >
    {siteConfig.name}
  </Link>
);

export const Header = () => {
  const pathname = usePathname();
  return (
    <header className="border-b bg-background">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <SiteLogo />
        <Navigation pathname={pathname} />
      </div>
    </header>
  );
};
