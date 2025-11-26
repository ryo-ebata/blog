import { BlogContainer } from '@/components/elements/blog-container';
import { BlogTitle } from '@/components/elements/blog-title';
import { Pagination } from '@/components/elements/pagination';
import { PostList } from '@/components/elements/post-list';
import { paginateItems } from '@/lib/pagination';
import { getAllPosts } from '@/lib/posts';

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 3600; // 1時間ごとに再検証

export default async function BlogIndex({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const allPosts = await getAllPosts();
  const { items: posts, totalPages } = paginateItems(allPosts, currentPage, 10);

  return (
    <BlogContainer>
      <BlogTitle />
      <PostList posts={posts} />
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
    </BlogContainer>
  );
}
