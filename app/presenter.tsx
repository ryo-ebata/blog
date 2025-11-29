'use client';

import Link from 'next/link';
import { Container } from '@/components/composites/container';
import { QiitaArticleCard } from '@/components/composites/qiita-article-card/qiita-article-card';
import { ZennArticleCard } from '@/components/composites/zenn-article-card/zenn-article-card';
import { PostCard } from '@/components/elements/post-card/post-card';
import { MdxHeading } from '@/components/mdx/heading/heading';
import type { PostMetadata } from '@/lib/posts';
import type { QiitaArticle } from '@/utils/qiita';
import type { ZennArticle } from '@/utils/zenn';

type ArticleItem =
  | { type: 'zenn'; article: ZennArticle }
  | { type: 'qiita'; article: QiitaArticle };

interface HomePresenterProps {
  posts: PostMetadata[];
  articles: ArticleItem[];
}

export function HomePresenter({ posts, articles }: HomePresenterProps) {
  return (
    <Container maxWidth="4xl">
      <div className="space-y-12">
        <div className="mb-12 text-center space-y-4">
          <MdxHeading as="h1">記事一覧</MdxHeading>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            情報（Information）ではなく、知識（Knowledge）と意見（Opinion）と気付き（Insight）を書きます。
          </p>
        </div>

        {posts.length > 0 && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">最新記事</h2>
              <Link
                href="/blog"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200"
              >
                すべての記事を見る →
              </Link>
            </div>
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.slug} metadata={post} />
              ))}
            </div>
          </>
        )}
        {articles.length > 0 && (
          <div className="space-y-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">外部記事</h2>
            </div>
            <div className="space-y-6">
              {articles.map((item) =>
                item.type === 'zenn' ? (
                  <ZennArticleCard key={`zenn-${item.article.id}`} article={item.article} />
                ) : (
                  <QiitaArticleCard key={`qiita-${item.article.id}`} article={item.article} />
                )
              )}
            </div>
            <div className="text-center text-gray-600 dark:text-gray-400">
              その他ソーシャル記事はAboutページから
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
