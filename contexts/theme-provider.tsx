'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
      // イベントハンドラ内でのDOM操作は許容される
      // systemテーマの場合、OS設定の変更に応じてDOMを更新
      if (queryTheme === 'system' || queryTheme === null) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [queryTheme]);

  const actualTheme = useMemo(() => {
    const currentTheme = queryTheme ?? 'dark';
    if (currentTheme === 'dark') return 'dark';
    if (currentTheme === 'light') return 'light';
    // theme === 'system' の場合はOS設定を反映
    return preferColorSchemeIsDark ? 'dark' : 'light';
  }, [queryTheme, preferColorSchemeIsDark]);

  // テーマを更新する関数
  // イベントハンドラ内でのDOM操作は許容される
  const updateTheme = useCallback(
    (newTheme: Theme) => {
      if (newTheme === 'system') {
        setQueryTheme('system');
      } else if (newTheme === 'dark') {
        setQueryTheme(null); // デフォルト値なのでクエリパラメータをクリア
      } else {
        setQueryTheme(newTheme);
      }

      // イベントハンドラ内でのDOM操作は許容される
      // 新しいテーマに基づいてDOMを更新
      const newActualTheme =
        newTheme === 'system'
          ? preferColorSchemeIsDark
            ? 'dark'
            : 'light'
          : newTheme === 'light'
            ? 'light'
            : 'dark';

      if (typeof document !== 'undefined') {
        if (newActualTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    [preferColorSchemeIsDark, setQueryTheme]
  );

  const value: ThemeContextValue = useMemo(() => {
    const theme: Theme =
      queryTheme === 'light' || queryTheme === 'dark' || queryTheme === 'system'
        ? queryTheme
        : 'dark';
    return {
      theme,
      setTheme: updateTheme,
      actualTheme,
    };
  }, [queryTheme, actualTheme, updateTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
