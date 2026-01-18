'use client';

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextValue {
  actualTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getActualTheme = (newTheme: Theme, preferColorSchemeIsDark: boolean): 'dark' | 'light' => {
  if (newTheme === 'system') {
    if (preferColorSchemeIsDark) {
      return 'dark';
    }
    return 'light';
  }
  if (newTheme === 'light') {
    return 'light';
  }
  return 'dark';
};

/**
 * Storybook用のThemeProvider
 * nuqsを使わずにローカルステートで管理します
 */
export const StorybookThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [preferColorSchemeIsDark, setPreferColorSchemeIsDark] = useState(false);

  useEffect(() => {
    /*
     * クライアントサイドでのみ実行
     */
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPreferColorSchemeIsDark(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPreferColorSchemeIsDark(event.matches);
      /*
       * イベントハンドラ内でのDOM操作は許容される
       * Systemテーマの場合、OS設定の変更に応じてDOMを更新
       */
      if (theme === 'system') {
        if (event.matches) {
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
    if (theme === 'dark') {
      return 'dark';
    }
    if (theme === 'light') {
      return 'light';
    }
    /*
     * Theme === 'system' の場合はOS設定を反映
     */
    if (preferColorSchemeIsDark) {
      return 'dark';
    }
    return 'light';
  }, [theme, preferColorSchemeIsDark]);

  /*
   * テーマを更新する関数
   * イベントハンドラ内でのDOM操作は許容される
   */
  const updateTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);

      /*
       * イベントハンドラ内でのDOM操作は許容される
       * 新しいテーマに基づいてDOMを更新
       */
      const newActualTheme = getActualTheme(newTheme, preferColorSchemeIsDark);

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

  const value: ThemeContextValue = useMemo(
    () => ({
      actualTheme,
      setTheme: updateTheme,
      theme,
    }),
    [theme, actualTheme, updateTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within StorybookThemeProvider');
  }
  return context;
};
