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
import { parseAsString, useQueryState } from 'nuqs';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const themeParser = parseAsString.withDefault('dark').withOptions({
  clearOnDefault: true,
});

const resolveActualTheme = (theme: Theme, prefersDark: boolean): 'dark' | 'light' => {
  if (theme === 'dark') {
    return 'dark';
  }
  if (theme === 'light') {
    return 'light';
  }
  if (prefersDark) {
    return 'dark';
  }
  return 'light';
};

const applyThemeToDOM = (actualTheme: 'dark' | 'light'): void => {
  if (typeof document === 'undefined') {
    return;
  }
  if (actualTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const resolveThemeFromQuery = (queryTheme: string | null): Theme => {
  if (queryTheme === 'light' || queryTheme === 'dark' || queryTheme === 'system') {
    return queryTheme;
  }
  return 'dark';
};

const usePreferColorScheme = (queryTheme: string | null) => {
  const [preferColorSchemeIsDark, setPreferColorSchemeIsDark] = useState(false);

  useEffect(() => {
    /* クライアントサイドでのみ実行 */
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPreferColorSchemeIsDark(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPreferColorSchemeIsDark(event.matches);
      /*
       * イベントハンドラ内でのDOM操作は許容される
       * Systemテーマの場合、OS設定の変更に応じてDOMを更新
       */
      if (queryTheme === 'system' || queryTheme === null) {
        if (event.matches) {
          applyThemeToDOM('dark');
        } else {
          applyThemeToDOM('light');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [queryTheme]);

  return preferColorSchemeIsDark;
};

const useThemeState = () => {
  const [queryTheme, setQueryTheme] = useQueryState('theme', themeParser);
  const preferColorSchemeIsDark = usePreferColorScheme(queryTheme);

  const actualTheme = useMemo(() => {
    const currentTheme = queryTheme ?? 'dark';
    /* Theme === 'system' の場合はOS設定を反映 */
    return resolveActualTheme(currentTheme as Theme, preferColorSchemeIsDark);
  }, [queryTheme, preferColorSchemeIsDark]);

  /*
   * テーマを更新する関数
   * イベントハンドラ内でのDOM操作は許容される
   */
  const updateTheme = useCallback(
    (newTheme: Theme) => {
      if (newTheme === 'system') {
        setQueryTheme('system');
      } else if (newTheme === 'dark') {
        /* デフォルト値なのでクエリパラメータをクリア */
        setQueryTheme(null);
      } else {
        setQueryTheme(newTheme);
      }
      const newActualTheme = resolveActualTheme(newTheme, preferColorSchemeIsDark);
      applyThemeToDOM(newActualTheme);
    },
    [preferColorSchemeIsDark, setQueryTheme]
  );

  const value: ThemeContextValue = useMemo(() => {
    const theme = resolveThemeFromQuery(queryTheme);
    return {
      actualTheme,
      setTheme: updateTheme,
      theme,
    };
  }, [queryTheme, actualTheme, updateTheme]);

  return value;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const value = useThemeState();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
