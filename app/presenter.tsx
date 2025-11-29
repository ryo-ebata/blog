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

const HEADING_TEXT = '$ ls -la articles/';
const DESCRIPTION_TEXT =
  '// 情報（Information）ではなく、知識（Knowledge）と意見（Opinion）と気付き（Insight）を書きます。';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-bold font-mono text-terminal-cyan dark:text-terminal-cyan terminal-glow">
      {children}
    </h2>
  );
}

function BlogLink() {
  return (
    <div className="text-center flex justify-end">
      <Link
        href="/blog"
        className="terminal-glow underline text-terminal-blue hover:text-terminal-cyan transition-colors duration-200 font-mono"
      >
        $ cd ./blog {'# すべての記事'}
      </Link>
    </div>
  );
}

function ExternalArticlesLink() {
  return (
    <div className="text-center text-gray-600 dark:text-gray-300 font-mono terminal-glow underline text-terminal-blue hover:text-terminal-cyan transition-colors duration-200">
      $ cd ./about {'# その他ソーシャル記事を見る'}
    </div>
  );
}

export function HomePresenter({ posts, articles }: HomePresenterProps) {
  const hasPosts = posts.length > 0;
  const hasArticles = articles.length > 0;
  const shouldPrioritizeFirstArticle = !hasPosts && hasArticles;

  return (
    <Container maxWidth="4xl">
      <div className="space-y-12">
        <div className="mb-12 text-center space-y-4">
          <MdxHeading
            as="h1"
            className="text-terminal-green dark:text-terminal-green terminal-glow font-mono"
          >
            {HEADING_TEXT}
          </MdxHeading>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-mono">
            {DESCRIPTION_TEXT}
          </p>
        </div>

        {hasPosts && (
          <div className="space-y-4">
            <div className="mb-8 flex items-center justify-between">
              <SectionHeading>[最新記事]</SectionHeading>
            </div>
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.slug} metadata={post} />
              ))}
            </div>
            <BlogLink />
          </div>
        )}

        {hasArticles && (
          <div className="space-y-4">
            <div className="mb-8 flex items-center justify-between">
              <SectionHeading>[外部記事]</SectionHeading>
            </div>
            <div className="space-y-6">
              {articles.map((item, index) =>
                item.type === 'zenn' ? (
                  <ZennArticleCard
                    key={`zenn-${item.article.id}`}
                    article={item.article}
                    priority={index === 0 && shouldPrioritizeFirstArticle}
                  />
                ) : (
                  <QiitaArticleCard
                    key={`qiita-${item.article.id}`}
                    article={item.article}
                    priority={index === 0 && shouldPrioritizeFirstArticle}
                  />
                )
              )}
            </div>
            <ExternalArticlesLink />
          </div>
        )}

        {!hasPosts && <BlogLink />}
      </div>
    </Container>
  );
}
