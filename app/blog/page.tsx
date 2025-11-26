import { BlogContainer } from '@/components/elements/blog-container';
import { BlogTitle } from '@/components/elements/blog-title';
import { PostList } from '@/components/elements/post-list';
import { getAllPosts } from '@/lib/posts';

export const revalidate = 3600; // 1時間ごとに再検証

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <BlogContainer>
      <BlogTitle />
      <PostList posts={posts} />
    </BlogContainer>
  );
}
