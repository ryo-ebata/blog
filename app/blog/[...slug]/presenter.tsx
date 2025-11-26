'use client';

import { BackLink, PostHeader } from '@/components/elements';
import type { PostMetadata } from '@/lib/posts';

interface BlogPostPresenterProps {
  metadata: PostMetadata;
}

export function BlogPostPresenter({ metadata }: BlogPostPresenterProps) {
  return (
    <>
      <BackLink />
      <PostHeader metadata={metadata} />
    </>
  );
}
