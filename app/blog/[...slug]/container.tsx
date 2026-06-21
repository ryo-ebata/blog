import { notFound } from 'next/navigation';
import { Separator } from '@/components/atoms/separator';
import { Container } from '@/components/organisms';
import { PromoBlock } from '@/components/organisms/promo-block/promo-block';
import { JsonLd } from '@/components/jsonld/jsonld';
import { SuggestEditLink } from '@/components/molecules/suggest-edit-link/suggest-edit-link';
import { siteConfig } from '@/config/site';
import { generateArticleJsonLd } from '@/lib/jsonld';
import { getPostBySlug } from '@/lib/micro-cms/blog';
import { renderMicroCMSContent } from '@/lib/micro-cms/content-renderer';
import { extractToc } from '@/lib/micro-cms/extract-toc';
import { TableOfContents } from '@/components/organisms/table-of-contents/table-of-contents';
import { BlogPostPresenter } from './presenter';

interface BlogPostContainerProps {
  slug: string[];
}

const SuggestEditSection = ({ slug, title }: { slug: string; title: string }) => (
  <div className="flex justify-end px-6 py-4">
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
    const toc = extractToc(post.contentHtml);

    const { slug: postSlug, title: postTitle } = post.metadata;

    return (
      <>
        <JsonLd data={articleJsonLd} />
        <Container maxWidth="3xl">
          <BlogPostPresenter metadata={post.metadata} />
          <SuggestEditSection slug={postSlug} title={postTitle} />
          <Separator />
          <PromoBlock placement="article-top" />
          <div className="mx-auto max-w-[42rem]">
            <TableOfContents items={toc} />
          </div>
          <article className="prose prose-neutral dark:prose-invert mx-auto max-w-[42rem]">
            {content}
          </article>
          <PromoBlock placement="article-bottom" />
          <Separator />
          <SuggestEditSection slug={postSlug} title={postTitle} />
        </Container>
      </>
    );
  } catch {
    notFound();
  }
};
