import { getAllPosts } from '@/lib/posts';
import type { QiitaArticle } from '@/utils/qiita';
import { getQiitaArticles } from '@/utils/qiita';
import type { ZennArticle } from '@/utils/zenn';
import { getZennArticles } from '@/utils/zenn';
import { HomePresenter } from './presenter';

type ArticleItem =
  | { type: 'zenn'; article: ZennArticle }
  | { type: 'qiita'; article: QiitaArticle };

interface ArticleWithLikes {
  type: 'zenn' | 'qiita';
  article: ZennArticle | QiitaArticle;
  likesCount: number;
}

const MAX_EXTERNAL_ARTICLES = 5;

export async function HomeContainer() {
  const [posts, zennArticlesResponse, qiitaArticles] = await Promise.all([
    getAllPosts(),
    getZennArticles(),
    getQiitaArticles(),
  ]);

  const zennArticles = zennArticlesResponse.articles;

  // Zenn記事とQiita記事をマージしていいね数でソート（最大5件）
  const articlesWithLikes: ArticleWithLikes[] = [
    ...zennArticles.map((article) => ({
      type: 'zenn' as const,
      article,
      likesCount: article.liked_count,
    })),
    ...qiitaArticles.map((article) => ({
      type: 'qiita' as const,
      article,
      likesCount: article.likes_count,
    })),
  ];

  const allArticles: ArticleItem[] = articlesWithLikes
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, MAX_EXTERNAL_ARTICLES)
    .map(({ type, article }): ArticleItem => {
      if (type === 'zenn') {
        return { type: 'zenn', article: article as ZennArticle };
      }
      return { type: 'qiita', article: article as QiitaArticle };
    });

  return <HomePresenter posts={posts.map((post) => post.metadata)} articles={allArticles} />;
}
