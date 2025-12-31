import { notFound } from 'next/navigation';
import { Container } from '@/components/composites/container';
import { JsonLd } from '@/components/jsonld/jsonld';
import { siteConfig } from '@/config/site';
import { generateArticleJsonLd } from '@/lib/jsonld';
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

    const postUrl = `${siteConfig.url}/blog/${post.metadata.slug}`;
    const articleJsonLd = generateArticleJsonLd(post.metadata, postUrl);

    return (
      <>
        <JsonLd data={articleJsonLd} />
        <Container maxWidth="3xl">
          <BlogPostPresenter metadata={post.metadata} />
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <post.Content />
          </article>
        </Container>
      </>
    );
  } catch (error) {
    console.error(`Failed to load post with slug "${slug.join('/')}":`, error);
    notFound();
  }
}
