import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

interface ContainerProps {
  children: ReactNode;
  maxWidth?: ContainerMaxWidth;
}

const maxWidthClasses: Record<ContainerMaxWidth, string> = {
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  lg: 'max-w-lg',
  md: 'max-w-md',
  sm: 'max-w-sm',
  xl: 'max-w-xl',
} as const;

export const Container = ({ children, maxWidth = '4xl' }: ContainerProps) => (
  <div className="min-h-screen bg-background">
    {/* 中央寄せ + 最大幅 + 余白リズム（ReUI: 横は段階的、縦は一定の呼吸） */}
    <div className={cn('mx-auto px-4 py-8 sm:px-6 lg:px-8', maxWidthClasses[maxWidth])}>
      {children}
    </div>
  </div>
);
