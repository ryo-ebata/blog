import { siteConfig } from '@/config/site';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { SitemapContainer } from './container';

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  description: `${siteConfig.name}のサイトマップです。すべてのページと記事の一覧を確認できます。`,
  title: 'サイトマップ',
  url: `${siteConfig.url}/sitemap-page`,
});

const SitemapPage = () => <SitemapContainer />;

export default SitemapPage;
