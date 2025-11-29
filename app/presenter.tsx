'use client';

import { ArticleCard } from '@/components/composites/article-card/article-card';
import { Container } from '@/components/composites/container';
import { BackLink } from '@/components/elements';
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
                <ArticleCard
                  key={post.slug}
                  title={post.title}
                  href={`/blog/${post.slug}`}
                  date={post.createdAt}
                  tags={post.tags}
                  description={post.description}
                  icon={post.icon ? { type: 'icon', name: post.icon, color: 'green' } : undefined}
                  hoverColor="green"
                  isExternal={false}
                />
              ))}
            </div>
            <div className="text-center flex justify-end">
              <BackLink href="/blog" label="$ cd ./blog # すべての記事" />
            </div>
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
                  <ArticleCard
                    key={`zenn-${item.article.id}`}
                    title={item.article.title}
                    href={`https://zenn.dev${item.article.path}`}
                    date={item.article.published_at}
                    tags={[item.article.post_type]}
                    icon={{ type: 'emoji', emoji: item.article.emoji, color: 'purple' }}
                    hoverColor="purple"
                    isExternal={true}
                    priority={index === 0 && shouldPrioritizeFirstArticle}
                  />
                ) : (
                  <ArticleCard
                    key={`qiita-${item.article.id}`}
                    title={item.article.title}
                    href={item.article.url}
                    date={item.article.created_at}
                    tags={item.article.tags.length > 0 ? [item.article.tags[0].name] : []}
                    icon={{
                      type: 'image',
                      src: '/image/qiita-icon/qiita-icon.png',
                      alt: item.article.user.name,
                      color: 'orange',
                    }}
                    hoverColor="orange"
                    isExternal={true}
                    priority={index === 0 && shouldPrioritizeFirstArticle}
                  />
                )
              )}
            </div>
            <div className="text-end">
              <BackLink href="/about" label="$ cd ./about # その他ソーシャル記事を見る" />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
