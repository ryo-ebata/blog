'use client';

import { ArticleCard, Container } from '@/components/organisms';
import { BackLink } from '@/components/atoms';

import type { BaseContentMetadata } from '@/lib/content';
import type { QiitaArticle } from '@/lib/external/qiita';
import type { ZennArticle } from '@/lib/external/zenn';

type ArticleItem =
  | { article: ZennArticle; type: 'zenn' }
  | { article: QiitaArticle; type: 'qiita' };

interface HomePresenterProps {
  articles: ArticleItem[];
  posts: BaseContentMetadata[];
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-foreground">{children}</h2>;
}

function getQiitaTags(tags: QiitaArticle['tags']): string[] {
  if (tags.length > 0) {
    return [tags[0].name];
  }
  return [];
}

function renderArticle(item: ArticleItem, index: number, shouldPrioritizeFirst: boolean) {
  if (item.type === 'zenn') {
    return (
      <ArticleCard
        key={`zenn-${item.article.id}`}
        date={item.article.published_at}
        href={`https://zenn.dev${item.article.path}`}
        icon={{ emoji: item.article.emoji, type: 'emoji' }}
        isExternal
        priority={index === 0 && shouldPrioritizeFirst}
        tags={[item.article.post_type]}
        title={item.article.title}
      />
    );
  }

  return (
    <ArticleCard
      key={`qiita-${item.article.id}`}
      date={item.article.created_at}
      href={item.article.url}
      icon={{
        alt: item.article.user.name,
        src: '/image/qiita-icon/qiita-icon.png',
        type: 'image',
      }}
      isExternal
      priority={index === 0 && shouldPrioritizeFirst}
      tags={getQiitaTags(item.article.tags)}
      title={item.article.title}
    />
  );
}

interface PostsSectionProps {
  posts: BaseContentMetadata[];
}

function PostsSection({ posts }: PostsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="mb-8 flex items-center justify-between">
        <SectionHeading>最新記事</SectionHeading>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <ArticleCard
            key={post.slug}
            date={post.createdAt}
            description={post.description}
            eyecatch={post.eyecatch}
            href={`/blog/${post.slug}`}
            isExternal={false}
            tags={post.tags}
            title={post.title}
          />
        ))}
      </div>
      <div className="text-center flex justify-end">
        <BackLink href="/blog" label="すべての記事を見る" />
      </div>
    </div>
  );
}

interface ArticlesSectionProps {
  articles: ArticleItem[];
  shouldPrioritizeFirstArticle: boolean;
}

function ArticlesSection({ articles, shouldPrioritizeFirstArticle }: ArticlesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="mb-8 flex items-center justify-between">
        <SectionHeading>外部記事</SectionHeading>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((item, index) => renderArticle(item, index, shouldPrioritizeFirstArticle))}
      </div>
      <div className="text-end">
        <BackLink href="/about" label="その他ソーシャル記事を見る" />
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="mb-12 text-center space-y-4">
      <h1 className="font-bold scroll-m-20 text-3xl text-foreground">Articles</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        情報（Information）ではなく、知識（Knowledge）と意見（Opinion）と気付き（Insight）を書きます。
      </p>
    </div>
  );
}

export function HomePresenter({ articles, posts }: HomePresenterProps) {
  const hasPosts = posts.length > 0;
  const hasArticles = articles.length > 0;
  const shouldPrioritizeFirstArticle = !hasPosts && hasArticles;

  return (
    <Container maxWidth="4xl">
      <div className="space-y-12">
        <PageHeader />

        {hasPosts && <PostsSection posts={posts} />}

        {hasArticles && (
          <ArticlesSection
            articles={articles}
            shouldPrioritizeFirstArticle={shouldPrioritizeFirstArticle}
          />
        )}
      </div>
    </Container>
  );
}
