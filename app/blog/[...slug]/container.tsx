import { notFound } from 'next/navigation';
import { Container } from '@/components/composites/container';
import { getPostBySlug } from '@/lib/posts';
import { BlogPostPresenter } from './presenter';

interface BlogPostContainerProps {
  slug: string[];
}

export async function BlogPostContainer({ slug }: BlogPostContainerProps) {
  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      notFound();
    }

    return (
      <Container maxWidth="3xl">
        <BlogPostPresenter metadata={post.metadata} />
        <post.Content />
      </Container>
    );
  } catch (error) {
    console.error(`Failed to load post with slug "${slug.join('/')}":`, error);
    notFound();
  }
}
