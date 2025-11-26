'use client';

import { Container } from '@/components/composites/container';
import { BlogTitle, PostList } from '@/components/elements';
import { Pagination } from '@/components/elements/pagination';
import type { PostMetadata } from '@/lib/posts';

interface BlogListPresenterProps {
  posts: PostMetadata[];
  currentPage: number;
  totalPages: number;
}

export function BlogListPresenter({ posts, currentPage, totalPages }: BlogListPresenterProps) {
  return (
    <Container>
      <BlogTitle />
      <PostList posts={posts} />
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
    </Container>
  );
}
