'use client';

import { Container } from '@/components/composites/container';
import { PostList } from '@/components/elements';
import { Pagination } from '@/components/elements/pagination/pagination';
import { MdxHeading } from '@/components/mdx/heading/heading';
import type { PostMetadata } from '@/lib/posts';

interface BlogListPresenterProps {
  posts: PostMetadata[];
  currentPage: number;
  totalPages: number;
}

const HEADING_TEXT = '$ ls -la ./blog';
const DESCRIPTION_TEXT = '// すべてのブログ記事';

export function BlogListPresenter({ posts, currentPage, totalPages }: BlogListPresenterProps) {
  return (
    <Container maxWidth="4xl">
      <div className="space-y-12">
        <div className="mb-12 text-center space-y-4">
          <MdxHeading
            as="h1"
            className="text-terminal-green dark:text-terminal-green terminal-glow font-mono"
          >
            {HEADING_TEXT}
          </MdxHeading>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-mono">
            {DESCRIPTION_TEXT}
          </p>
        </div>

        <div className="space-y-6">
          <PostList posts={posts} />
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
        </div>
      </div>
    </Container>
  );
}
