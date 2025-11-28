'use client';

import { Heart } from 'lucide-react';
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
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 mt-1">
          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl">
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
            className="text-2xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-gray-900 dark:text-gray-100 mb-2 block"
          >
            <MdxHeading as="h2">{article.title}</MdxHeading>
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <TagList tags={article.tags.length > 0 ? [article.tags[0].name] : []} />
            <Time date={article.created_at} />
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {article.likes_count}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
