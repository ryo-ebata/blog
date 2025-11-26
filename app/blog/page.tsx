import { BlogListContainer } from './container';

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export const revalidate = 3600; // 1時間ごとに再検証

export default async function BlogListPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams;

  return <BlogListContainer currentPage={page ? parseInt(page, 10) : 1} />;
}
