'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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
      // イベントハンドラ内でのDOM操作は許容される
      // systemテーマの場合、OS設定の変更に応じてDOMを更新
      if (theme === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const actualTheme = useMemo(() => {
    if (theme === 'dark') return 'dark';
    if (theme === 'light') return 'light';
    // theme === 'system' の場合はOS設定を反映
    return preferColorSchemeIsDark ? 'dark' : 'light';
  }, [theme, preferColorSchemeIsDark]);

  // テーマを更新する関数
  // イベントハンドラ内でのDOM操作は許容される
  const updateTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);

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
    [preferColorSchemeIsDark]
  );

  const value: ThemeContextValue = useMemo(() => {
    return {
      theme,
      setTheme: updateTheme,
      actualTheme,
    };
  }, [theme, actualTheme, updateTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within StorybookThemeProvider');
  }
  return context;
}
