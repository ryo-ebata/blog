import { cn } from '@/lib/utils';

const Separator = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<'div'> & {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}) => (
  <div
    data-slot="separator"
    data-orientation={orientation}
    role={decorative ? 'none' : 'separator'}
    aria-orientation={decorative ? undefined : orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'vertical' ? 'h-full w-px self-stretch' : 'h-px w-full',
      className
    )}
    {...props}
  />
);

export { Separator };
