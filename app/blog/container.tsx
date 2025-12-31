import { paginateItems } from '@/lib/pagination';
import { getAllPosts } from '@/lib/posts';
import { filterPostsByTitle } from '@/lib/search';
import { BlogListPresenter } from './presenter';

interface BlogListContainerProps {
  currentPage: number;
  searchQuery: string;
}

const POSTS_PER_PAGE = 10;

export async function BlogListContainer({ currentPage, searchQuery }: BlogListContainerProps) {
  try {
    const allPosts = await getAllPosts();
    const allPostsMetadata = allPosts.map((post) => post.metadata);

    const filteredPosts = filterPostsByTitle(allPostsMetadata, searchQuery);
    const { items: posts, totalPages } = paginateItems(filteredPosts, currentPage, POSTS_PER_PAGE);

    return (
      <BlogListPresenter
        posts={posts}
        totalPages={totalPages}
        currentPage={currentPage}
        searchQuery={searchQuery}
      />
    );
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    return (
      <BlogListPresenter posts={[]} totalPages={0} currentPage={currentPage} searchQuery="" />
    );
  }
}
