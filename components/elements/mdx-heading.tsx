import type { ComponentPropsWithoutRef } from 'react';

type HeadingProps = ComponentPropsWithoutRef<'h1'> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export function Heading({ as: Component = 'h1', className = '', children, ...props }: HeadingProps) {
  const baseClasses = 'font-bold text-gray-900 dark:text-gray-100';
  const sizeClasses = {
    h1: 'text-4xl mt-8 mb-4',
    h2: 'text-3xl mt-6 mb-3',
    h3: 'text-2xl mt-5 mb-2',
    h4: 'text-xl mt-4 mb-2',
    h5: 'text-lg mt-3 mb-1',
    h6: 'text-base mt-2 mb-1',
  };

  return (
    <Component
      className={`${baseClasses} ${sizeClasses[Component]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

