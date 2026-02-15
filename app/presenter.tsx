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

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-foreground">{children}</h2>
);

const FIRST_INDEX = 0;

const renderZennArticle = (
  item: { article: ZennArticle; type: 'zenn' },
  index: number,
  shouldPrioritizeFirstArticle: boolean
) => (
  <ArticleCard
    key={`zenn-${item.article.id}`}
    date={item.article.published_at}
    href={`https://zenn.dev${item.article.path}`}
    icon={{ emoji: item.article.emoji, type: 'emoji' }}
    isExternal
    priority={index === FIRST_INDEX && shouldPrioritizeFirstArticle}
    tags={[item.article.post_type]}
    title={item.article.title}
  />
);

const getQiitaTags = (tags: QiitaArticle['tags']): string[] => {
  if (tags.length > FIRST_INDEX) {
    return [tags[FIRST_INDEX].name];
  }
  return [];
};

const renderQiitaArticle = (
  item: { article: QiitaArticle; type: 'qiita' },
  index: number,
  shouldPrioritizeFirstArticle: boolean
) => {
  const tags = getQiitaTags(item.article.tags);

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
      priority={index === FIRST_INDEX && shouldPrioritizeFirstArticle}
      tags={tags}
      title={item.article.title}
    />
  );
};

interface PostsSectionProps {
  posts: BaseContentMetadata[];
}

const PostsSection = ({ posts }: PostsSectionProps) => (
  <div className="space-y-4">
    <div className="mb-8 flex items-center justify-between">
      <SectionHeading>最新記事</SectionHeading>
    </div>
    <div className="space-y-6">
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

interface ArticlesSectionProps {
  articles: ArticleItem[];
  shouldPrioritizeFirstArticle: boolean;
}

const renderArticle = (item: ArticleItem, index: number, shouldPrioritizeFirstArticle: boolean) => {
  if (item.type === 'zenn') {
    return renderZennArticle(item, index, shouldPrioritizeFirstArticle);
  }
  return renderQiitaArticle(item, index, shouldPrioritizeFirstArticle);
};

const ArticlesSection = ({ articles, shouldPrioritizeFirstArticle }: ArticlesSectionProps) => (
  <div className="space-y-4">
    <div className="mb-8 flex items-center justify-between">
      <SectionHeading>外部記事</SectionHeading>
    </div>
    <div className="space-y-6">
      {articles.map((item, index) => renderArticle(item, index, shouldPrioritizeFirstArticle))}
    </div>
    <div className="text-end">
      <BackLink href="/about" label="その他ソーシャル記事を見る" />
    </div>
  </div>
);

const PageHeader = () => (
  <div className="mb-12 text-center space-y-4">
    <h1 className="font-bold scroll-m-20 text-3xl text-foreground">Articles</h1>
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
      情報（Information）ではなく、知識（Knowledge）と意見（Opinion）と気付き（Insight）を書きます。
    </p>
  </div>
);

export const HomePresenter = ({ articles, posts }: HomePresenterProps) => {
  const hasPosts = posts.length > FIRST_INDEX;
  const hasArticles = articles.length > FIRST_INDEX;
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
};
