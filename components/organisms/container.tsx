import type { ReactNode } from 'react';

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
    <div className={`${maxWidthClasses[maxWidth]} mx-auto py-8 px-4`}>{children}</div>
  </div>
);
