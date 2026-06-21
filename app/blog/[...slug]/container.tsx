import { notFound } from 'next/navigation';
import { Separator } from '@/components/atoms/separator';
import { Container } from '@/components/organisms';
import { PromoBlock } from '@/components/organisms/promo-block/promo-block';
import { JsonLd } from '@/components/jsonld/jsonld';
import { Breadcrumb } from '@/components/molecules/breadcrumb/breadcrumb';
import { ReadingProgress } from '@/components/molecules/reading-progress/reading-progress';
import { ShareButtons } from '@/components/molecules/share-buttons/share-buttons';
import { GiscusComments } from '@/components/organisms/comments/giscus-comments';
import { SuggestEditLink } from '@/components/molecules/suggest-edit-link/suggest-edit-link';
import { siteConfig } from '@/config/site';
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/jsonld';
import { getAllPostsMetadata, getPostBySlug } from '@/lib/micro-cms/blog';
import { renderMicroCMSContent } from '@/lib/micro-cms/content-renderer';
import { extractToc } from '@/lib/micro-cms/extract-toc';
import { getRelatedPosts } from '@/lib/related';
import { PostList } from '@/components/organisms/post-list/post-list';
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
    const relatedPosts = getRelatedPosts(post.metadata, await getAllPostsMetadata(), 3);

    const { slug: postSlug, title: postTitle } = post.metadata;

    const breadcrumbItems = [
      { name: 'Home', href: '/' },
      { name: 'ブログ', href: '/blog' },
      { name: postTitle },
    ];
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
      { name: 'Home', url: siteConfig.url },
      { name: 'ブログ', url: `${siteConfig.url}/blog` },
      { name: postTitle, url: postUrl },
    ]);

    return (
      <>
        <JsonLd data={articleJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />
        <ReadingProgress />
        <Container maxWidth="3xl">
          <Breadcrumb items={breadcrumbItems} />
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
          <div className="mx-auto mt-6 max-w-[42rem]">
            <ShareButtons url={postUrl} title={postTitle} />
          </div>
          <PromoBlock placement="article-bottom" />
          {relatedPosts.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-5 text-lg font-semibold text-foreground">関連記事</h2>
              <PostList posts={relatedPosts} />
            </section>
          )}
          <Separator />
          <SuggestEditSection slug={postSlug} title={postTitle} />
          <GiscusComments />
        </Container>
      </>
    );
  } catch {
    notFound();
  }
};
