import type { ReactNode } from 'react';

export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

interface ContainerProps {
  children: ReactNode;
  maxWidth?: ContainerMaxWidth;
}

const maxWidthClasses: Record<ContainerMaxWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
} as const;

export function Container({ children, maxWidth = '4xl' }: ContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className={`${maxWidthClasses[maxWidth]} mx-auto py-8 px-4`}>{children}</div>
    </div>
  );
}
