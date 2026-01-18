import type { QiitaArticle } from '@/lib/external/qiita';
import { getQiitaArticles } from '@/lib/external/qiita';
import type { ZennArticle } from '@/lib/external/zenn';
import { getZennArticles } from '@/lib/external/zenn';
import { getAllPosts } from '@/lib/posts';
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
      article,
      likesCount: article.liked_count,
      type: 'zenn' as const,
    })),
    ...qiitaArticles.map((article) => ({
      article,
      likesCount: article.likes_count,
      type: 'qiita' as const,
    })),
  ];

  const allArticles: ArticleItem[] = articlesWithLikes
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, MAX_EXTERNAL_ARTICLES)
    .map(({ type, article }): ArticleItem => {
      if (type === 'zenn') {
        return { article: article as ZennArticle, type: 'zenn' };
      }
      return { article: article as QiitaArticle, type: 'qiita' };
    });

  return <HomePresenter posts={posts.map((post) => post.metadata)} articles={allArticles} />;
}
