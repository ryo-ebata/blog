'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_MENU_ID = 'header-nav-menu';

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
  <Link
    href={href}
    aria-current={isActive ? 'page' : undefined}
    className={getLinkClassName(isActive)}
  >
    {label}
  </Link>
);

interface NavigationProps {
  isMenuOpen: boolean;
  pathname: string;
}

const Navigation = ({ isMenuOpen, pathname }: NavigationProps) => (
  <nav
    id={NAV_MENU_ID}
    className={cn(
      'absolute inset-x-0 top-full flex-col items-start gap-4 border-t border-foreground/10 bg-background px-4 py-4',
      isMenuOpen ? 'flex' : 'hidden',
      'sm:static sm:flex sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:border-0 sm:bg-transparent sm:p-0 sm:gap-6'
    )}
  >
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

interface MenuToggleButtonProps {
  isMenuOpen: boolean;
  onClick: () => void;
}

const MenuToggleButton = ({ isMenuOpen, onClick }: MenuToggleButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    className="cursor-pointer sm:hidden"
    aria-expanded={isMenuOpen}
    aria-controls={NAV_MENU_ID}
    onClick={onClick}
  >
    {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
    <span className="sr-only">メニューを{isMenuOpen ? '閉じる' : '開く'}</span>
  </Button>
);

const useCloseMenuOnNavigate = (pathname: string, setIsMenuOpen: (open: boolean) => void) => {
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname, setIsMenuOpen]);
};

const useCloseMenuOnOutsideInteraction = (
  isMenuOpen: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  setIsMenuOpen: (open: boolean) => void
) => {
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, containerRef, setIsMenuOpen]);
};

export const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useCloseMenuOnNavigate(pathname, setIsMenuOpen);
  useCloseMenuOnOutsideInteraction(isMenuOpen, containerRef, setIsMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur ring-1 ring-foreground/10">
      <div
        ref={containerRef}
        className="relative mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4"
      >
        <SiteLogo />
        <MenuToggleButton isMenuOpen={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)} />
        <Navigation isMenuOpen={isMenuOpen} pathname={pathname} />
      </div>
    </header>
  );
};
