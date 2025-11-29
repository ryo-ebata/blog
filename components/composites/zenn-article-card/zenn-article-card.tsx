'use client';

import Link from 'next/link';
import { Time } from '@/components/elements/time/time';
import { MdxHeading } from '@/components/mdx/heading/heading';
import type { ZennArticle } from '@/utils/zenn';
import { TagList } from '../tag-list';

interface ZennArticleCardProps {
  article: ZennArticle;
  priority?: boolean;
}

export function ZennArticleCard({ article, priority = false }: ZennArticleCardProps) {
  return (
    <article
      key={article.id}
      className="terminal-card rounded-none p-6 transition-all duration-300 font-mono"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 mt-1">
          <div className="w-12 h-12 rounded-none bg-terminal-border dark:bg-terminal-border border border-terminal-purple flex items-center justify-center text-2xl terminal-glow">
            {article.emoji}
          </div>
        </div>
        <div className="flex-1">
          <Link
            href={`https://zenn.dev${article.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-2 block"
          >
            <MdxHeading
              as="h2"
              className="text-terminal-cyan dark:text-terminal-cyan group-hover:text-terminal-purple transition-colors duration-200"
            >
              {article.title}
            </MdxHeading>
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <TagList tags={[article.post_type]} />
            <Time date={article.published_at} />
          </div>
        </div>
      </div>
    </article>
  );
}
