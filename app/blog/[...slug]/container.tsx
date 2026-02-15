import { notFound } from 'next/navigation';
import { Container } from '@/components/organisms';
import { JsonLd } from '@/components/jsonld/jsonld';
import { SuggestEditLink } from '@/components/molecules/suggest-edit-link/suggest-edit-link';
import { siteConfig } from '@/config/site';
import { generateArticleJsonLd } from '@/lib/jsonld';
import { getPostBySlug } from '@/lib/micro-cms/blog';
import { renderMicroCMSContent } from '@/lib/micro-cms/content-renderer';
import { BlogPostPresenter } from './presenter';

interface BlogPostContainerProps {
  slug: string[];
}

const SuggestEditSection = ({ slug, title }: { slug: string; title: string }) => (
  <div className="flex justify-end border-b px-6 py-4">
    <SuggestEditLink slug={slug} title={title} />
  </div>
);

export const BlogPostContainer = async ({ slug }: BlogPostContainerProps) => {
  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      notFound();
    }

    const postUrl = `${siteConfig.url}/blog/${post.metadata.slug}`;
    const articleJsonLd = generateArticleJsonLd(post.metadata, postUrl);
    const content = await renderMicroCMSContent(post.contentHtml);

    const { slug: postSlug, title: postTitle } = post.metadata;

    return (
      <>
        <JsonLd data={articleJsonLd} />
        <Container maxWidth="3xl">
          <BlogPostPresenter metadata={post.metadata} />
          <SuggestEditSection slug={postSlug} title={postTitle} />
          <article className="prose prose-neutral dark:prose-invert max-w-none">{content}</article>
          <SuggestEditSection slug={postSlug} title={postTitle} />
        </Container>
      </>
    );
  } catch {
    notFound();
  }
};
