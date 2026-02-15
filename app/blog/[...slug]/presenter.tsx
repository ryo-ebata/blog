'use client';

import { BackLink } from '@/components/atoms';
import { PostHeader } from '@/components/organisms';
import type { BaseContentMetadata } from '@/lib/content';

interface BlogPostPresenterProps {
  metadata: BaseContentMetadata;
}

export const BlogPostPresenter = ({ metadata }: BlogPostPresenterProps) => (
  <>
    <BackLink href="/blog" label="ブログ一覧に戻る" />
    <PostHeader metadata={metadata} />
  </>
);
