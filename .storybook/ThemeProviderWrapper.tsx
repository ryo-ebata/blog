'use client';

import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Storybook用のThemeProvider
 * nuqsを使わずにローカルステートで管理します
 */
export function StorybookThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [preferColorSchemeIsDark, setPreferColorSchemeIsDark] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPreferColorSchemeIsDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPreferColorSchemeIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const actualTheme = useMemo(() => {
    if (theme === 'dark') return 'dark';
    if (theme === 'light') return 'light';
    // theme === 'system' の場合はOS設定を反映
    return preferColorSchemeIsDark ? 'dark' : 'light';
  }, [theme, preferColorSchemeIsDark]);

  useEffect(() => {
    if (actualTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [actualTheme]);

  const value: ThemeContextValue = useMemo(() => {
    return {
      theme,
      setTheme: setThemeState,
      actualTheme,
    };
  }, [theme, actualTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within StorybookThemeProvider');
  }
  return context;
}
