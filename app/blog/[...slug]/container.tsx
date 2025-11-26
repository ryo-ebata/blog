import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/posts';
import { Container } from '@/components/composites/container';
import { PostContent } from '@/components/elements';
import { BlogPostPresenter } from './presenter';

interface BlogPostContainerProps {
  slug: string[];
}

export async function BlogPostContainer({ slug }: BlogPostContainerProps) {
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Container maxWidth="3xl">
      <BlogPostPresenter metadata={post.metadata} />
      <PostContent Content={post.Content} />
    </Container>
  );
}
