'use server';

import 'server-only';
import { z } from 'zod';

const zennUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  name: z.string(),
  avatar_small_url: z.string(),
});

const zennPublicationSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string(),
  avatar_small_url: z.string(),
  avatar_url: z.string(),
  pro: z.boolean(),
  avatar_registered: z.boolean(),
});

const zennArticleSchema = z.object({
  id: z.number(),
  post_type: z.string(),
  title: z.string(),
  slug: z.string(),
  comments_count: z.number(),
  liked_count: z.number(),
  bookmarked_count: z.number(),
  body_letters_count: z.number(),
  article_type: z.string(),
  emoji: z.string(),
  is_suspending_private: z.boolean(),
  published_at: z.string(),
  body_updated_at: z.string(),
  source_repo_updated_at: z.string().nullable(),
  pinned: z.boolean(),
  path: z.string(),
  principal_type: z.string(),
  user: zennUserSchema,
  publication: zennPublicationSchema,
  publication_article_override: z.unknown().nullable(),
});

const zennArticlesResponseSchema = z.object({
  articles: z.array(zennArticleSchema),
  next_page: z.number().nullable(),
  total_count: z.number().nullable(),
});

export type ZennUser = z.infer<typeof zennUserSchema>;
export type ZennPublication = z.infer<typeof zennPublicationSchema>;
export type ZennArticle = z.infer<typeof zennArticleSchema>;
export type ZennArticlesResponse = z.infer<typeof zennArticlesResponseSchema>;

export async function getZennArticles(): Promise<ZennArticlesResponse> {
  const response = await fetch('https://zenn.dev/api/articles?username=ebarinyo', {
    next: {
      revalidate: 3600, // 1時間ごとに再検証
      tags: ['zenn-articles'],
    },
  });
  const data = await response.json();
  return zennArticlesResponseSchema.parse(data);
}
