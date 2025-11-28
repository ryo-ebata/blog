'use server';

import 'server-only';
import { z } from 'zod';
import { envConfig } from '@/config/env';

const qiitaTagSchema = z.object({
  name: z.string(),
  versions: z.array(z.unknown()),
});

const qiitaUserSchema = z.object({
  description: z.string(),
  facebook_id: z.string(),
  followees_count: z.number(),
  followers_count: z.number(),
  github_login_name: z.string().nullable(),
  id: z.string(),
  items_count: z.number(),
  linkedin_id: z.string(),
  location: z.string(),
  name: z.string(),
  organization: z.string(),
  permanent_id: z.number(),
  profile_image_url: z.string(),
  team_only: z.boolean(),
  twitter_screen_name: z.string(),
  website_url: z.string(),
});

const qiitaArticleSchema = z.object({
  rendered_body: z.string(),
  body: z.string(),
  coediting: z.boolean(),
  comments_count: z.number(),
  created_at: z.string(),
  group: z.unknown().nullable(),
  id: z.string(),
  likes_count: z.number(),
  private: z.boolean(),
  reactions_count: z.number(),
  stocks_count: z.number(),
  tags: z.array(qiitaTagSchema),
  title: z.string(),
  updated_at: z.string(),
  url: z.string(),
  user: qiitaUserSchema,
  page_views_count: z.number(),
  team_membership: z.unknown().nullable(),
  organization_url_name: z.string(),
  slide: z.boolean(),
});

const qiitaArticlesResponseSchema = z.array(qiitaArticleSchema);

export type QiitaTag = z.infer<typeof qiitaTagSchema>;
export type QiitaUser = z.infer<typeof qiitaUserSchema>;
export type QiitaArticle = z.infer<typeof qiitaArticleSchema>;
export type QiitaArticlesResponse = z.infer<typeof qiitaArticlesResponseSchema>;

/**
 * Qiitaの記事を取得
 */
export async function getQiitaArticles(): Promise<QiitaArticlesResponse> {
  const response = await fetch(`${envConfig.qiita.QIITA_API_URL}/authenticated_user/items`, {
    headers: {
      Authorization: `Bearer ${envConfig.qiita.QIITA_API_ACCESS_TOKEN}`,
    },
    next: {
      revalidate: 3600, // 1時間ごとに再検証
      tags: ['qiita-articles'],
    },
  });

  const data = await response.json();
  return qiitaArticlesResponseSchema.parse(data);
}
