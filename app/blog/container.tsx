import { paginateItems } from '@/lib/pagination';
import { getAllPosts } from '@/lib/posts';
import { BlogListPresenter } from './presenter';

interface BlogListContainerProps {
  currentPage: number;
}

const POSTS_PER_PAGE = 10;

export async function BlogListContainer({ currentPage }: BlogListContainerProps) {
  try {
    const allPosts = await getAllPosts();
    const { items: posts, totalPages } = paginateItems(allPosts, currentPage, POSTS_PER_PAGE);

    // metadataのみを抽出してClient Componentに渡す
    const postsMetadata = posts.map((post) => post.metadata);

    return (
      <BlogListPresenter posts={postsMetadata} totalPages={totalPages} currentPage={currentPage} />
    );
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    return <BlogListPresenter posts={[]} totalPages={0} currentPage={currentPage} />;
  }
}
