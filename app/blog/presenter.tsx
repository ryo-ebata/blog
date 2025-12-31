'use client';

import { Container } from '@/components/composites/container';
import { PostList } from '@/components/elements';
import { Pagination } from '@/components/elements/pagination/pagination';
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
          <h1 className="font-bold font-mono text-terminal-green terminal-glow scroll-m-20 text-3xl">
            {HEADING_TEXT}
          </h1>
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
