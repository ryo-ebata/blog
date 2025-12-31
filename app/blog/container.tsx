import { paginateItems } from '@/lib/pagination';
import { getAllPosts } from '@/lib/posts';
import { filterPostsByTitle } from '@/lib/search';
import { aggregateTags, filterPostsByTags } from '@/lib/tags';
import { BlogListPresenter } from './presenter';

interface BlogListContainerProps {
  currentPage: number;
  searchQuery: string;
  selectedTags: string[];
}

const POSTS_PER_PAGE = 10;

export async function BlogListContainer({
  currentPage,
  searchQuery,
  selectedTags,
}: BlogListContainerProps) {
  try {
    const allPosts = await getAllPosts();
    const allPostsMetadata = allPosts.map((post) => post.metadata);

    const tagCounts = aggregateTags(allPostsMetadata);
    const filteredByTags = filterPostsByTags(allPostsMetadata, selectedTags);
    const filteredPosts = filterPostsByTitle(filteredByTags, searchQuery);
    const { items: posts, totalPages } = paginateItems(filteredPosts, currentPage, POSTS_PER_PAGE);

    return (
      <BlogListPresenter
        posts={posts}
        totalPages={totalPages}
        currentPage={currentPage}
        searchQuery={searchQuery}
        selectedTags={selectedTags}
        tagCounts={tagCounts}
      />
    );
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    return (
      <BlogListPresenter
        posts={[]}
        totalPages={0}
        currentPage={currentPage}
        searchQuery=""
        selectedTags={[]}
        tagCounts={[]}
      />
    );
  }
}
