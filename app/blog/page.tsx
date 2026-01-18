import { siteConfig } from '@/config/site';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { BlogListContainer } from './container';

interface BlogPageProps {
  searchParams: Promise<{ page?: string; search?: string; tags?: string }>;
}

export const revalidate = 3600; // 1時間ごとに再検証

export const metadata = generatePageMetadata({
  description: `${siteConfig.name}のブログ記事一覧です。技術的な学びや日々の気づきを共有しています。`,
  title: 'ブログ',
  url: `${siteConfig.url}/blog`,
});

export default async function BlogListPage({ searchParams }: BlogPageProps) {
  const { page, search, tags } = await searchParams;
  const selectedTags = tags ? tags.split(',').filter(Boolean) : [];

  return (
    <BlogListContainer
      currentPage={page ? parseInt(page, 10) : 1}
      searchQuery={search ?? ''}
      selectedTags={selectedTags}
    />
  );
}
