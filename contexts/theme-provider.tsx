'use client';

import { useQueryState } from 'nuqs';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { parseAsString } from 'nuqs';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const themeParser = parseAsString.withDefault('dark').withOptions({
  clearOnDefault: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [queryTheme, setQueryTheme] = useQueryState('theme', themeParser);
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
    const currentTheme = queryTheme ?? 'dark';
    if (currentTheme === 'dark') return 'dark';
    if (currentTheme === 'light') return 'light';
    // theme === 'system' の場合はOS設定を反映
    return preferColorSchemeIsDark ? 'dark' : 'light';
  }, [queryTheme, preferColorSchemeIsDark]);

  useEffect(() => {
    if (actualTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [actualTheme]);

  const value: ThemeContextValue = useMemo(
    () => ({
      theme: queryTheme ?? 'dark',
      setTheme: (newTheme) => {
        if (newTheme === 'system') {
          setQueryTheme('system');
        } else if (newTheme === 'dark') {
          setQueryTheme(null); // デフォルト値なのでクエリパラメータをクリア
        } else {
          setQueryTheme(newTheme);
        }
      },
      actualTheme,
    }),
    [queryTheme, setQueryTheme, actualTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
