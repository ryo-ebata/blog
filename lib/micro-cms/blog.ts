import { cacheLife, cacheTag } from 'next/cache';
import type { BaseContentMetadata } from '@/lib/content';
import type { MicroCMSBlog, MicroCMSContentData, MicroCMSListResponse } from './types';
import { toBaseContentMetadata } from './types';
import { microCmsClient } from './client';
import { countHtmlCharacters, extractPlainText } from './count-characters';

const MICROCMS_LIST_LIMIT = 100;
const ENDPOINT = 'blog';

const fetchAllBlogs = async (): Promise<MicroCMSBlog[]> => {
  const allContents: MicroCMSBlog[] = [];
  let offset = 0;
  let totalCount = 0;

  do {
    const response: MicroCMSListResponse<MicroCMSBlog> = await microCmsClient.getList({
      endpoint: ENDPOINT,
      queries: { limit: MICROCMS_LIST_LIMIT, offset },
    });

    allContents.push(...response.contents);
    totalCount = response.totalCount;
    offset += MICROCMS_LIST_LIMIT;
  } while (offset < totalCount);

  return allContents;
};

const sortByDateDescending = (a: BaseContentMetadata, b: BaseContentMetadata): number => {
  const dateA = new Date(a.createdAt).getTime();
  const dateB = new Date(b.createdAt).getTime();
  return dateB - dateA;
};

export const getAllPostsMetadata = async (): Promise<BaseContentMetadata[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('posts');

  const blogs = await fetchAllBlogs();

  return blogs
    .map((blog) => ({
      ...toBaseContentMetadata(blog, countHtmlCharacters(blog.content)),
      searchText: extractPlainText(blog.content),
    }))
    .sort(sortByDateDescending);
};

export const getPostBySlug = async (slug: string | string[]): Promise<MicroCMSContentData> => {
  'use cache';
  cacheLife('hours');
  cacheTag('posts');

  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;
  cacheTag(`post-${slugPath}`);

  const response: MicroCMSListResponse<MicroCMSBlog> = await microCmsClient.getList({
    endpoint: ENDPOINT,
    queries: { limit: 1, filters: `slug[equals]${slugPath}` },
  });

  if (response.contents.length === 0) {
    throw new Error(`Post not found: ${slugPath}`);
  }

  const blog = response.contents[0];
  return {
    contentHtml: blog.content,
    metadata: toBaseContentMetadata(blog, countHtmlCharacters(blog.content)),
  };
};
