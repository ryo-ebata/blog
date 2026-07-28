'use client';

import { PostHeader } from '@/components/organisms';
import type { BaseContentMetadata } from '@/lib/content';

interface BlogPostPresenterProps {
  metadata: BaseContentMetadata;
}

export const BlogPostPresenter = ({ metadata }: BlogPostPresenterProps) => (
  <PostHeader metadata={metadata} />
);
