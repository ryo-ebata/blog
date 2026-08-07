#!/usr/bin/env node
/**
 * microCMSの全記事をREST API経由で取得し、blog-obsidian/public/blogs/{slug}/index.md へ
 * Markdown化して書き出す一度きりの移行ツール。
 * 実行: node --env-file=.env.local scripts/migrate-from-microcms.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';

const MICROCMS_LIST_LIMIT = 100;
const BLOG_CONTENT_ROOT = path.join(process.cwd(), 'blog-obsidian', 'public', 'blogs');

const domain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!domain || !apiKey) {
  console.error(
    '[migrate] MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が未設定です。' +
      '`node --env-file=.env.local scripts/migrate-from-microcms.mjs` で実行してください。'
  );
  process.exit(1);
}

const microCmsFetch = async (apiPath, params = {}) => {
  const url = new URL(`https://${domain}.microcms.io/api/v1${apiPath}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': apiKey } });
  if (!response.ok) {
    throw new Error(`microCMS API error: ${response.status} ${url}`);
  }
  return response.json();
};

const fetchAllBlogs = async () => {
  const allContents = [];
  let offset = 0;
  let totalCount = 0;

  do {
    const response = await microCmsFetch('/blog', { limit: MICROCMS_LIST_LIMIT, offset });
    allContents.push(...response.contents);
    totalCount = response.totalCount;
    offset += MICROCMS_LIST_LIMIT;
  } while (offset < totalCount);

  return allContents;
};

/* iframely埋め込み(div.iframely-embed > div.iframely-responsive > a[href])を
   標準的な単独リンク段落<p><a href="URL">URL</a></p>に正規化する。
   lib/blog-content/rehype-link-card.ts の isIframelyEmbed と同じ検出条件を踏襲。
   これを挟まないと rehype-remark は空リンク[](url)に変換してしまい、
   移行後のMarkdownで当方のrehypeLinkCard検出パターンから外れてしまう。 */
const normalizeIframely = () => (tree) => {
  visit(tree, 'element', (node, index, parent) => {
    if (node.tagName !== 'div' || index === undefined || !parent) {
      return;
    }
    const classNames = node.properties?.className;
    if (!Array.isArray(classNames) || !classNames.includes('iframely-responsive')) {
      return;
    }
    const anchor = node.children.find((child) => child.type === 'element' && child.tagName === 'a');
    const href = anchor ? String(anchor.properties?.href ?? '') : '';
    if (!href) {
      return;
    }
    parent.children[index] = {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [
        {
          type: 'element',
          tagName: 'a',
          properties: { href },
          children: [{ type: 'text', value: href }],
        },
      ],
    };
  });
};

/* mdast-util-to-markdownが強調記号(**)直前のCJK文字を数値文字参照にエスケープすることがあるため
   (例: "さんの**強調**" → "さん&#x306E;**強調**")、出力後に数値文字参照を元の文字へデコードして戻す */
const decodeNumericEntities = (text) =>
  text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)));

const htmlToMarkdown = async (html) => {
  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(normalizeIframely)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify, { bullet: '-' })
    .process(html);
  return decodeNumericEntities(String(file).trim());
};

const collectImageUrls = (html) => {
  const urls = new Set();
  for (const match of html.matchAll(/<img[^>]*src="([^"]+)"/g)) {
    urls.add(match[1]);
  }
  return [...urls];
};

const usedFileNames = new Map();

const resolveImageFileName = (slug, url) => {
  const baseName = decodeURIComponent(path.basename(new URL(url).pathname));
  const key = `${slug}/${baseName}`;
  const count = usedFileNames.get(key) ?? 0;
  usedFileNames.set(key, count + 1);
  if (count === 0) {
    return baseName;
  }
  const ext = path.extname(baseName);
  const stem = baseName.slice(0, baseName.length - ext.length);
  return `${stem}-${count}${ext}`;
};

const downloadImage = async (slug, url, imagesDir) => {
  const fileName = resolveImageFileName(slug, url);
  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`[migrate] 画像ダウンロード失敗 (${response.status}): ${url}`);
    return null;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(imagesDir, { recursive: true });
  await writeFile(path.join(imagesDir, fileName), buffer);
  return fileName;
};

const yamlString = (value) => `"${String(value).replace(/"/g, '\\"')}"`;

const buildFrontmatter = (blog, eyecatchFileName) => {
  const lines = [
    `title: ${yamlString(blog.title)}`,
    ...(blog.description ? [`description: ${yamlString(blog.description)}`] : []),
    `createdAt: ${yamlString(blog.publishedAt ?? blog.createdAt)}`,
    `updatedAt: ${yamlString(blog.updatedAt)}`,
    ...(blog.tags?.length
      ? [`tags:`, ...blog.tags.map((tag) => `  - ${yamlString(tag.name)}`)]
      : []),
    `draft: false`,
    ...(eyecatchFileName
      ? [
          `eyecatch:`,
          `  url: images/${eyecatchFileName}`,
          ...(blog.eyecatch?.width ? [`  width: ${blog.eyecatch.width}`] : []),
          ...(blog.eyecatch?.height ? [`  height: ${blog.eyecatch.height}`] : []),
        ]
      : []),
  ];
  return `---\n${lines.join('\n')}\n---\n`;
};

const migrateOne = async (blog) => {
  const detail = await microCmsFetch(`/blog/${blog.id}`);
  const slug = detail.slug ?? detail.id;
  const articleDir = path.join(BLOG_CONTENT_ROOT, slug);
  const imagesDir = path.join(articleDir, 'images');

  let markdown = await htmlToMarkdown(detail.content ?? '');

  const bodyImageUrls = collectImageUrls(detail.content ?? '');
  for (const url of bodyImageUrls) {
    const fileName = await downloadImage(slug, url, imagesDir);
    if (fileName) {
      markdown = markdown.split(url).join(`images/${fileName}`);
    }
  }

  let eyecatchFileName;
  if (detail.eyecatch?.url) {
    eyecatchFileName = await downloadImage(slug, detail.eyecatch.url, imagesDir);
  }

  const frontmatter = buildFrontmatter(detail, eyecatchFileName ?? undefined);
  await mkdir(articleDir, { recursive: true });
  await writeFile(path.join(articleDir, 'index.md'), `${frontmatter}\n${markdown}\n`);

  return { slug, imageCount: bodyImageUrls.length + (eyecatchFileName ? 1 : 0) };
};

const main = async () => {
  console.log('[migrate] microCMSから記事一覧を取得しています...');
  const blogs = await fetchAllBlogs();
  console.log(`[migrate] ${blogs.length}件の記事を移行します`);

  const results = [];
  for (const blog of blogs) {
    const result = await migrateOne(blog);
    results.push(result);
    console.log(`[migrate] ✓ ${result.slug} (画像${result.imageCount}件)`);
  }

  console.log(
    `[migrate] 完了: ${results.length}記事、画像${results.reduce((sum, r) => sum + r.imageCount, 0)}件`
  );
};

main().catch((error) => {
  console.error('[migrate] 失敗しました:', error);
  process.exitCode = 1;
});
