import { createSuggestEditUrl } from '@/lib/github';
import { buttonVariants } from '@/components/atoms/button';
import { cn } from '@/lib/utils';
import { Github } from 'lucide-react';

interface SuggestEditLinkProps {
  slug: string;
  title: string;
}

export const SuggestEditLink = ({ slug, title }: SuggestEditLinkProps) => {
  const url = createSuggestEditUrl(title, slug);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-muted-foreground')}
    >
      <Github />
      修正を提案する
    </a>
  );
};
