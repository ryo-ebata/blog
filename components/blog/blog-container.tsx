import type { ReactNode } from 'react';

type BlogContainerProps = {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
};

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
};

export function BlogContainer({ children, maxWidth = '4xl' }: BlogContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${maxWidthClasses[maxWidth]} mx-auto py-8 px-4`}>{children}</div>
    </div>
  );
}
