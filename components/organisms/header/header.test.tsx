import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './header';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('@/contexts/theme-provider', () => ({
  useTheme: () => ({
    theme: 'dark',
    actualTheme: 'dark',
    setTheme: vi.fn(),
  }),
}));

describe('Header', () => {
  it('サイト名を表示する', () => {
    render(<Header />);
    expect(screen.getByText('ebaryo.dev')).toBeInTheDocument();
  });

  it('ナビゲーションリンクを表示する', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument();
  });

  it('テーマ切り替えボタンを表示する', () => {
    render(<Header />);
    expect(screen.getByText('テーマを切り替え')).toBeInTheDocument();
  });

  it('header要素としてレンダリングする', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
