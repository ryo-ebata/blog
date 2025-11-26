import { paginateItems } from '@/lib/pagination';
import { getAllPosts } from '@/lib/posts';
import { BlogListPresenter } from './presenter';

interface BlogListContainerProps {
  currentPage: number;
}

export async function BlogListContainer({ currentPage }: BlogListContainerProps) {
  const allPosts = await getAllPosts();
  const { items: posts, totalPages } = paginateItems(allPosts, currentPage, 10);

  // metadataのみを抽出してClient Componentに渡す
  const postsMetadata = posts.map((post) => post.metadata);

  return (
    <BlogListPresenter posts={postsMetadata} totalPages={totalPages} currentPage={currentPage} />
  );
}
