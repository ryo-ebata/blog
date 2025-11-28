import { getAllPosts } from '@/lib/posts';
import type { QiitaArticle } from '@/utils/qiita';
import { getQiitaArticles } from '@/utils/qiita';
import type { ZennArticle } from '@/utils/zenn';
import { getZennArticles } from '@/utils/zenn';
import { HomePresenter } from './presenter';

type ArticleItem =
  | { type: 'zenn'; article: ZennArticle }
  | { type: 'qiita'; article: QiitaArticle };

export async function HomeContainer() {
  const [posts, zennArticlesResponse, qiitaArticles] = await Promise.all([
    getAllPosts(),
    getZennArticles(),
    getQiitaArticles(),
  ]);

  const zennArticles = zennArticlesResponse.articles;

  // Zenn記事とQiita記事をマージしていいね数でソート
  const allArticles: ArticleItem[] = [
    ...zennArticles.map((article): { type: 'zenn'; article: ZennArticle; likesCount: number } => ({
      type: 'zenn' as const,
      article,
      likesCount: article.liked_count,
    })),
    ...qiitaArticles.map(
      (article): { type: 'qiita'; article: QiitaArticle; likesCount: number } => ({
        type: 'qiita' as const,
        article,
        likesCount: article.likes_count,
      })
    ),
  ]
    .sort((a, b) => b.likesCount - a.likesCount)
    .map(({ type, article }): ArticleItem => ({ type, article }) as ArticleItem);

  return <HomePresenter latestPosts={posts.map((post) => post.metadata)} articles={allArticles} />;
}
