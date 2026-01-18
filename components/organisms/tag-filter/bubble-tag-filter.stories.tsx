import type { Meta, StoryObj } from '@storybook/react';
import type { TagCount } from '@/lib/tags';

import { BubbleTagFilter } from './bubble-tag-filter';

/*
 * マジックナンバー定数
 */
const SLICE_START = 0;
const MIN_COUNT = 1;
const COUNT_BASE = 100;
const INDEX_OFFSET = 1;
const MANY_TAGS_COUNT = 30;
const HUNDRED_TAGS_COUNT = 100;

const meta = {
  component: BubbleTagFilter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'composites/BubbleTagFilter',
} satisfies Meta<typeof BubbleTagFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

const generateManyTags = (count: number): TagCount[] => {
  const tagNames = [
    'React',
    'TypeScript',
    'Next.js',
    'JavaScript',
    'Node.js',
    'Python',
    'Go',
    'Rust',
    'AWS',
    'Docker',
    'Kubernetes',
    'GraphQL',
    'REST',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Tailwind',
    'CSS',
    'HTML',
    'Git',
    'CI/CD',
    'テスト',
    'パフォーマンス',
    'セキュリティ',
    'アーキテクチャ',
    '競馬',
    '雑記',
    'ポエム',
    'キャリア',
    '読書',
    'AI',
    '機械学習',
    'LLM',
    'ChatGPT',
    'Claude',
    'Vim',
    'Neovim',
    'VSCode',
    'Emacs',
    'Linux',
    'macOS',
    'Windows',
    'iOS',
    'Android',
    'Flutter',
    'React Native',
    'Swift',
    'Kotlin',
    'Java',
    'C++',
    'C#',
    '.NET',
    'Ruby',
    'Rails',
    'PHP',
    'Laravel',
    'Vue.js',
    'Angular',
    'Svelte',
    'Solid',
    'Remix',
    'Astro',
    'Vite',
    'Webpack',
    'Bun',
    'Deno',
    'Vercel',
    'Netlify',
    'Cloudflare',
    'Firebase',
    'Supabase',
    'PlanetScale',
    'Prisma',
    'Drizzle',
    'tRPC',
    'Zod',
    'Vitest',
    'Jest',
    'Playwright',
    'Cypress',
    'Storybook',
    'Figma',
    'デザイン',
    'UX',
    'アクセシビリティ',
    'i18n',
    'SSR',
    'SSG',
    'ISR',
    'Edge',
    'Serverless',
    'マイクロサービス',
    'モノレポ',
    'DDD',
    'TDD',
    'BDD',
    'アジャイル',
    'スクラム',
    'リファクタリング',
    'コードレビュー',
  ];

  return tagNames.slice(SLICE_START, count).map((tag, index) => ({
    count: Math.max(MIN_COUNT, Math.floor(COUNT_BASE / (index + INDEX_OFFSET))),
    tag,
  }));
};

const fewTags: TagCount[] = [
  { count: 15, tag: 'React' },
  { count: 12, tag: 'TypeScript' },
  { count: 8, tag: 'Next.js' },
  { count: 3, tag: '競馬' },
  { count: 2, tag: '雑記' },
];

const noopTagToggle = () => {};

export const Default: Story = {
  args: {
    onTagToggle: noopTagToggle,
    selectedTags: [],
    tags: fewTags,
  },
};

export const WithSelectedTags: Story = {
  args: {
    onTagToggle: noopTagToggle,
    selectedTags: ['React', '競馬'],
    tags: fewTags,
  },
};

export const ManyTags: Story = {
  args: {
    onTagToggle: noopTagToggle,
    selectedTags: [],
    tags: generateManyTags(MANY_TAGS_COUNT),
  },
};

export const HundredTags: Story = {
  args: {
    onTagToggle: noopTagToggle,
    selectedTags: [],
    tags: generateManyTags(HUNDRED_TAGS_COUNT),
  },
};

export const HundredTagsWithSelection: Story = {
  args: {
    onTagToggle: noopTagToggle,
    selectedTags: ['React', 'TypeScript', 'AI', '競馬'],
    tags: generateManyTags(HUNDRED_TAGS_COUNT),
  },
};

export const Empty: Story = {
  args: {
    onTagToggle: noopTagToggle,
    selectedTags: [],
    tags: [],
  },
};

export const SingleTag: Story = {
  args: {
    onTagToggle: noopTagToggle,
    selectedTags: [],
    tags: [{ count: 10, tag: 'React' }],
  },
};
