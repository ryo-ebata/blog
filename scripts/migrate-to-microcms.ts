import * as fs from 'node:fs';
import * as path from 'node:path';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

interface Frontmatter {
  slug: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  tags: string[];
  draft: boolean;
}

interface ParsedMdx {
  data: Frontmatter;
  content: string;
}

interface MicroCMSTagResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

const DRY_RUN = process.argv.includes('--dry-run');

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

const parseYamlValue = (value: string): string | boolean | string[] => {
  const trimmed = value.trim();

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  const inlineArrayMatch = trimmed.match(/^\[(.+)\]$/);
  if (inlineArrayMatch) {
    return inlineArrayMatch[1].split(',').map((item) => {
      const cleaned = item.trim();
      return cleaned.replace(/^['"]|['"]$/g, '');
    });
  }

  return trimmed.replace(/^['"]|['"]$/g, '');
};

const parseFrontmatter = (fileContent: string): ParsedMdx => {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid frontmatter format');
  }

  const yamlContent = match[1];
  const markdownContent = match[2];
  const data: Record<string, unknown> = {};

  let currentKey = '';
  let isMultilineArray = false;
  let multilineArray: string[] = [];

  for (const line of yamlContent.split('\n')) {
    if (isMultilineArray) {
      const arrayItemMatch = line.match(/^\s+-\s+(.+)$/);
      if (arrayItemMatch) {
        multilineArray.push(arrayItemMatch[1].replace(/^['"]|['"]$/g, ''));
        continue;
      }
      data[currentKey] = multilineArray;
      isMultilineArray = false;
      multilineArray = [];
    }

    const keyValueMatch = line.match(/^(\w+):\s*(.*)$/);
    if (!keyValueMatch) continue;

    const key = keyValueMatch[1];
    const rawValue = keyValueMatch[2];

    if (rawValue === '') {
      currentKey = key;
      isMultilineArray = true;
      multilineArray = [];
      continue;
    }

    data[key] = parseYamlValue(rawValue);
  }

  if (isMultilineArray) {
    data[currentKey] = multilineArray;
  }

  return {
    data: data as unknown as Frontmatter,
    content: markdownContent,
  };
};

const markdownToHtml = async (markdown: string): Promise<string> => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
};

const microCmsApiRequest = async <T>(
  method: 'GET' | 'POST',
  endpoint: string,
  body?: Record<string, unknown>,
  query?: string
): Promise<T> => {
  const serviceDomain = getEnv('MICROCMS_SERVICE_DOMAIN');
  const apiKey = getEnv('MICROCMS_API_KEY');
  const url = `https://${serviceDomain}.microcms.io/api/v1/${endpoint}${query ? `?${query}` : ''}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-MICROCMS-API-KEY': apiKey,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`microCMS API error: ${response.status} ${text}`);
  }

  return response.json() as Promise<T>;
};

const fetchAllTags = async (): Promise<MicroCMSTagResponse[]> => {
  const tags: MicroCMSTagResponse[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await microCmsApiRequest<MicroCMSListResponse<MicroCMSTagResponse>>(
      'GET',
      'tags',
      undefined,
      `limit=${limit}&offset=${offset}`
    );
    tags.push(...response.contents);
    if (tags.length >= response.totalCount) break;
    offset += limit;
  }

  return tags;
};

const ensureTag = async (tagName: string, existingTags: Map<string, string>): Promise<string> => {
  const existing = existingTags.get(tagName);
  if (existing) return existing;

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would create tag: ${tagName}`);
    const dryRunId = `dry-run-${tagName}`;
    existingTags.set(tagName, dryRunId);
    return dryRunId;
  }

  console.log(`  Creating tag: ${tagName}`);
  const result = await microCmsApiRequest<{ id: string }>('POST', 'tags', {
    name: tagName,
  });
  existingTags.set(tagName, result.id);
  return result.id;
};

const getMdxFiles = (directory: string): string[] => {
  const dirPath = path.resolve(directory);
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => path.join(dirPath, file));
};

const migrateFile = async (
  filePath: string,
  endpoint: string,
  existingTags: Map<string, string>
): Promise<void> => {
  const fileName = path.basename(filePath);
  console.log(`\nProcessing: ${fileName}`);

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = parseFrontmatter(fileContent);

  if (data.draft === true) {
    console.log(`  Skipped (draft): ${data.title}`);
    return;
  }

  const htmlContent = await markdownToHtml(content);

  const tagIds: string[] = [];
  if (data.tags && Array.isArray(data.tags)) {
    for (const tagName of data.tags) {
      const tagId = await ensureTag(tagName, existingTags);
      tagIds.push(tagId);
    }
  }

  const body: Record<string, unknown> = {
    title: data.title,
    slug: data.slug,
    description: data.description ?? '',
    content: htmlContent,
    tags: tagIds,
    publishedAt: data.createdAt ? new Date(data.createdAt).toISOString() : undefined,
  };

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would create: ${data.title}`);
    console.log(`  Endpoint: ${endpoint}`);
    console.log(`  Slug: ${data.slug}`);
    console.log(`  Tags: ${data.tags?.join(', ') ?? 'none'}`);
    console.log(`  Content length: ${htmlContent.length} chars (HTML)`);
    return;
  }

  await microCmsApiRequest('POST', endpoint, body);
  console.log(`  Created: ${data.title}`);
};

const main = async (): Promise<void> => {
  console.log('=== microCMS Migration Script ===');
  if (DRY_RUN) {
    console.log('Mode: DRY RUN (no API calls will be made)\n');
  } else {
    console.log('Mode: LIVE (data will be created in microCMS)\n');
  }

  const existingTags = new Map<string, string>();

  if (!DRY_RUN) {
    console.log('Fetching existing tags...');
    const tags = await fetchAllTags();
    for (const tag of tags) {
      existingTags.set(tag.name, tag.id);
    }
    console.log(`Found ${existingTags.size} existing tags`);
  }

  const postFiles = getMdxFiles('posts');

  console.log(`\nFound ${postFiles.length} posts`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  console.log('\n--- Migrating Posts ---');
  for (const file of postFiles) {
    try {
      const fileContent = fs.readFileSync(file, 'utf-8');
      const { data } = parseFrontmatter(fileContent);
      if (data.draft === true) {
        skipCount++;
      } else {
        successCount++;
      }
      await migrateFile(file, 'blog', existingTags);
    } catch (error) {
      errorCount++;
      console.error(
        `  Error processing ${path.basename(file)}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  console.log('\n=== Migration Summary ===');
  console.log(`  Success: ${successCount}`);
  console.log(`  Skipped (draft): ${skipCount}`);
  console.log(`  Errors: ${errorCount}`);
};

main().catch((error: unknown) => {
  console.error('Migration failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
