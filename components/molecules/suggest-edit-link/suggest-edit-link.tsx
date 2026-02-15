import { createSuggestEditUrl } from '@/lib/github';
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
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <Github className="w-4 h-4" />
      修正を提案する
    </a>
  );
};
