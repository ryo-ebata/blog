'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Time } from '@/components/elements/time/time';
import { MdxHeading } from '@/components/mdx/heading/heading';
import type { QiitaArticle } from '@/utils/qiita';
import { TagList } from '../tag-list';

interface QiitaArticleCardProps {
  article: QiitaArticle;
}

export function QiitaArticleCard({ article }: QiitaArticleCardProps) {
  return (
    <article
      key={article.id}
      className="terminal-card rounded-none p-6 transition-all duration-300 font-mono"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 mt-1">
          <div className="w-12 h-12 rounded-none bg-terminal-border dark:bg-terminal-border border border-terminal-orange flex items-center justify-center text-2xl terminal-glow">
            <Image
              src={'/image/qiita-icon/qiita-icon.png'}
              alt={article.user.name}
              width={36}
              height={36}
            />
          </div>
        </div>
        <div className="flex-1">
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-2 block"
          >
            <MdxHeading
              as="h2"
              className="text-terminal-cyan dark:text-terminal-cyan group-hover:text-terminal-orange transition-colors duration-200"
            >
              {article.title}
            </MdxHeading>
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <TagList tags={article.tags.length > 0 ? [article.tags[0].name] : []} />
            <Time date={article.created_at} />
          </div>
        </div>
      </div>
    </article>
  );
}
