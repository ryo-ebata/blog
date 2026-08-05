import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/**
 * AI検索(GPTBot/ClaudeBot/PerplexityBot等)・AI学習データ収集(Google-Extended/Applebot-Extended等)
 * に使われる主要クローラー。'*'ルールで実質許可済みだが、AI引用(AIO/GEO)を歓迎する意図を
 * 明示するため個別に許可する。
 */
const AI_SEARCH_USER_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
] as const;

const OPEN_ACCESS_RULE = { allow: '/', disallow: ['/api/'] };

const robots = (): MetadataRoute.Robots => ({
  rules: [
    { userAgent: '*', ...OPEN_ACCESS_RULE },
    ...AI_SEARCH_USER_AGENTS.map((userAgent) => ({ userAgent, ...OPEN_ACCESS_RULE })),
  ],
  sitemap: `${siteConfig.url}/sitemap.xml`,
  host: siteConfig.url,
});

export default robots;
