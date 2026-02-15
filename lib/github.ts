import { siteConfig } from '@/config/site';

export const createSuggestEditUrl = (title: string, slug: string): string => {
  const issueTitle = `修正提案: ${title}`;
  const issueBody = `## 対象記事\n\n- タイトル: ${title}\n- URL: ${siteConfig.url}/blog/${slug}\n\n## 修正内容\n\n<!-- 修正箇所と正しい内容を記載してください -->\n`;

  const params = new URLSearchParams({
    title: issueTitle,
    body: issueBody,
    labels: '修正提案',
  });

  return `https://github.com/${siteConfig.repo}/issues/new?${params.toString()}`;
};
