import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

const mockSetTheme = vi.fn();

vi.mock('@/contexts/theme-provider', () => ({
  useTheme: () => ({
    theme: 'dark',
    actualTheme: 'dark',
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle', () => {
  it('テーマ切り替えボタンを表示する', async () => {
    const { ThemeToggle } = await import('./theme-toggle');
    render(<ThemeToggle />);
    expect(screen.getByText('テーマを切り替え')).toBeInTheDocument();
  });

  it('クリックでテーマを切り替える', async () => {
    const { ThemeToggle } = await import('./theme-toggle');
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
