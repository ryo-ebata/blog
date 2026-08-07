import { getAllPostsMetadata } from '@/lib/blog-content/blog';
import { logger } from '@/lib/logger';
import { SitemapPresenter } from './presenter';

export const SitemapContainer = async () => {
  try {
    const posts = await getAllPostsMetadata();
    return <SitemapPresenter posts={posts} />;
  } catch (error) {
    logger.error('サイトマップの記事取得に失敗しました', { source: 'sitemap-page' }, error);
    return <SitemapPresenter posts={[]} />;
  }
};
