'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { useTheme } from '@/contexts/theme-provider';
import { cn } from '@/lib/utils';

const getNextTheme = (currentTheme: string): 'light' | 'dark' => {
  if (currentTheme === 'dark') {
    return 'light';
  }
  return 'dark';
};

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  const handleClick = () => {
    setTheme(getNextTheme(theme));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      aria-pressed={theme === 'dark'}
      onClick={handleClick}
    >
      <Sun
        className={cn('size-4 rotate-0 scale-100 transition-all', 'dark:-rotate-90 dark:scale-0')}
      />
      <Moon
        className={cn(
          'absolute size-4 rotate-90 scale-0 transition-all',
          'dark:rotate-0 dark:scale-100'
        )}
      />
      <span className="sr-only">テーマを切り替え</span>
    </Button>
  );
};
