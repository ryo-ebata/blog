import { notFound } from 'next/navigation';
import { Container } from '@/components/organisms';
import { JsonLd } from '@/components/jsonld/jsonld';
import { siteConfig } from '@/config/site';
import { generateArticleJsonLd } from '@/lib/jsonld';
import { getPostBySlug } from '@/lib/micro-cms/blog';
import { renderMicroCMSContent } from '@/lib/micro-cms/content-renderer';
import { BlogPostPresenter } from './presenter';

interface BlogPostContainerProps {
  slug: string[];
}

export const BlogPostContainer = async ({ slug }: BlogPostContainerProps) => {
  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      notFound();
    }

    const postUrl = `${siteConfig.url}/blog/${post.metadata.slug}`;
    const articleJsonLd = generateArticleJsonLd(post.metadata, postUrl);
    const content = await renderMicroCMSContent(post.contentHtml);

    return (
      <>
        <JsonLd data={articleJsonLd} />
        <Container maxWidth="3xl">
          <BlogPostPresenter metadata={post.metadata} />
          <article className="prose prose-neutral dark:prose-invert max-w-none">{content}</article>
        </Container>
      </>
    );
  } catch {
    notFound();
  }
};
