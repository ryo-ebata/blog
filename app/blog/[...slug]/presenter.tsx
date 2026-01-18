'use client';

import { BackLink } from '@/components/atoms';
import { PostHeader } from '@/components/organisms';
import type { PostMetadata } from '@/lib/posts';

interface BlogPostPresenterProps {
  metadata: PostMetadata;
}

export function BlogPostPresenter({ metadata }: BlogPostPresenterProps) {
  return (
    <>
      <BackLink href="/blog" label="ブログ一覧に戻る" />
      <PostHeader metadata={metadata} />
    </>
  );
}
