'use client';

import Editor from '@monaco-editor/react';
import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from 'react';
import { Children, isValidElement, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

export interface MdxPreProps extends ComponentPropsWithoutRef<'pre'> {
  children?: ReactNode;
}

export interface MdxCodeProps extends ComponentPropsWithoutRef<'code'> {
  children?: ReactNode;
  'data-language'?: string;
}

/**
 * childrenからcode要素の情報を抽出
 */
function extractCodeInfo(children: ReactNode): {
  code: string;
  language: string | null;
} | null {
  let codeContent = '';
  let language: string | null = null;

  const findCodeElement = (node: ReactNode): boolean => {
    if (!isValidElement(node)) {
      if (typeof node === 'string') {
        codeContent += node;
        return false;
      }
      return false;
    }

    // code要素またはMdxCodeコンポーネントをチェック
    const nodeType = node.type;
    const isCodeElement =
      nodeType === 'code' ||
      (typeof nodeType === 'function' &&
        (nodeType.name === 'MdxCode' ||
          (nodeType as { displayName?: string }).displayName === 'MdxCode'));

    if (isCodeElement) {
      const props = node.props as MdxCodeProps;
      const className = props.className || '';

      // 言語を抽出（language-xxx または data-language）
      const languageMatch = className.match(/language-(\w+)/);
      if (languageMatch) {
        language = languageMatch[1];
      } else if (props['data-language']) {
        language = props['data-language'];
      }

      // コード内容を抽出
      if (typeof props.children === 'string') {
        codeContent = props.children;
        return true;
      }

      // childrenが複雑な場合は再帰的に探索
      if (props.children) {
        const extractText = (child: ReactNode): void => {
          if (typeof child === 'string') {
            codeContent += child;
          } else if (typeof child === 'number') {
            codeContent += String(child);
          } else if (Array.isArray(child)) {
            child.forEach(extractText);
          } else if (isValidElement(child)) {
            // React要素の場合はchildrenを再帰的に探索
            const childProps = child.props as { children?: ReactNode };
            if (childProps?.children) {
              extractText(childProps.children);
            }
          }
        };

        const childrenArray = Array.isArray(props.children) ? props.children : [props.children];
        childrenArray.forEach(extractText);
      }

      return true;
    }

    // 子要素を再帰的に探索
    const nodeProps = node.props as { children?: ReactNode };
    if (nodeProps?.children) {
      Children.forEach(nodeProps.children, (child) => {
        findCodeElement(child);
      });
    }

    return false;
  };

  Children.forEach(children, (child) => {
    findCodeElement(child);
  });

  if (!codeContent) {
    return null;
  }

  return { code: codeContent.trim(), language };
}

/**
 * 現在のテーマを取得するフック
 * Storybook環境とNext.js環境の両方で動作します
 */
function useCurrentTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // 初期テーマを設定
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // テーマの変更を監視
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      setTheme(isDarkNow ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

/**
 * コードブロック用のpre要素コンポーネント
 * rehype-pretty-codeが生成するpre要素をラップし、Monaco Editorで表示します
 */
export function MdxPre({ className = '', children, ...props }: MdxPreProps) {
  const currentTheme = useCurrentTheme();
  const [mounted, setMounted] = useState(false);
  const codeInfo = useMemo(() => extractCodeInfo(children), [children]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // デバッグ用: コード情報を確認
  useEffect(() => {
    if (mounted && codeInfo) {
      console.log('Code info extracted:', {
        code: `${codeInfo.code.substring(0, 50)}...`,
        language: codeInfo.language,
        codeLength: codeInfo.code.length,
      });
    } else if (mounted && !codeInfo) {
      console.log('Code info not extracted, children:', children);
    }
  }, [mounted, codeInfo, children]);

  // コード情報が取得できない場合は従来の表示
  if (!codeInfo || !mounted) {
    return (
      <pre
        className={cn(
          'relative overflow-x-auto rounded-lg border border-terminal-border bg-terminal-bg p-4 font-mono text-sm leading-relaxed',
          className
        )}
        {...props}
      >
        {children}
      </pre>
    );
  }

  // Monaco Editorのテーマを決定
  const editorTheme = currentTheme === 'dark' ? 'vs-dark' : 'light';

  // 言語をMonaco Editorの形式に変換
  const monacoLanguage = codeInfo.language || 'plaintext';

  // pre要素のpropsからdiv要素に適用できるものだけを抽出
  const divProps = {
    ...(props.id && { id: props.id }),
    ...(props.title && { title: props.title }),
    ...(props.style && { style: props.style }),
  } as HTMLAttributes<HTMLDivElement>;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-terminal-border bg-terminal-bg',
        className
      )}
      {...divProps}
    >
      <Editor
        height={`${Math.max(200, codeInfo.code.split('\n').length * 20 + 32)}px`}
        language={monacoLanguage}
        value={codeInfo.code}
        theme={editorTheme}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on',
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
          },
        }}
        loading={
          <div className="flex h-32 items-center justify-center">
            <div className="text-sm text-gray-500">読み込み中...</div>
          </div>
        }
        onMount={(editor) => {
          // エディタがマウントされたらレイアウトを更新
          setTimeout(() => {
            editor.layout();
          }, 100);
        }}
      />
    </div>
  );
}

/**
 * インラインコード用のcode要素コンポーネント
 * インラインコードとコードブロック内のcode要素の両方を処理します
 */
export function MdxCode({
  className = '',
  children,
  'data-language': dataLanguage,
  ...props
}: MdxCodeProps) {
  // pre要素の子要素としてcode要素が存在する場合（コードブロック内）
  // 親要素がpreかどうかを判定するために、classNameに特定のクラスが含まれているか確認
  const isInline = !className?.includes('language-') && !dataLanguage;

  if (isInline) {
    // インラインコード
    return (
      <code
        className={cn(
          'relative rounded bg-terminal-bg px-1.5 py-0.5 font-mono text-sm',
          'border border-terminal-border',
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }

  // コードブロック内のcode要素（Monaco Editorで表示されるため、ここでは最小限のスタイル）
  return (
    <code className={cn('font-mono text-sm', className)} {...props}>
      {children}
    </code>
  );
}

// displayNameを設定してextractCodeInfoで識別できるようにする
MdxCode.displayName = 'MdxCode';

/**
 * 後方互換性のためのエクスポート
 * @deprecated MdxPreとMdxCodeを使用してください
 */
export function CodeBlock() {
  return <div>CodeBlock</div>;
}
