'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { useTheme } from '@/contexts/theme-provider';

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
      variant="outline"
      size="icon"
      className="transition-colors duration-200 hover:cursor-pointer"
      onClick={handleClick}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">テーマを切り替え</span>
    </Button>
  );
};
