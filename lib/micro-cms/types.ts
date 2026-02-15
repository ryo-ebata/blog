import type { BaseContentMetadata } from '@/lib/content';

export interface MicroCMSDate {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  revisedAt?: string;
}

export interface MicroCMSImage {
  url: string;
  height?: number;
  width?: number;
}

export interface MicroCMSTag extends MicroCMSDate {
  id: string;
  name: string;
}

export interface MicroCMSBlog extends MicroCMSDate {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  content: string;
  tags?: MicroCMSTag[];
  eyecatch?: MicroCMSImage;
}

export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface MicroCMSContentData {
  contentHtml: string;
  metadata: BaseContentMetadata;
}

export const toBaseContentMetadata = (
  blog: MicroCMSBlog,
  characterCount?: number
): BaseContentMetadata => ({
  characterCount,
  createdAt: blog.publishedAt ?? blog.createdAt,
  description: blog.description,
  eyecatch: blog.eyecatch,
  slug: blog.slug ?? blog.id,
  tags: blog.tags?.map((tag) => tag.name),
  title: blog.title,
  updatedAt: blog.updatedAt,
});
