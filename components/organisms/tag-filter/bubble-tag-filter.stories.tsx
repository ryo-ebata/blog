import type { Meta, StoryObj } from '@storybook/react';
import type { TagCount } from '@/lib/tags';
import { BubbleTagFilter } from './bubble-tag-filter';

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

  return tagNames.slice(0, count).map((tag, index) => ({
    count: Math.max(1, Math.floor(100 / (index + 1))),
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

export const Default: Story = {
  args: {
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
    selectedTags: [],
    tags: fewTags,
  },
};

export const WithSelectedTags: Story = {
  args: {
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
    selectedTags: ['React', '競馬'],
    tags: fewTags,
  },
};

export const ManyTags: Story = {
  args: {
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
    selectedTags: [],
    tags: generateManyTags(30),
  },
};

export const HundredTags: Story = {
  args: {
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
    selectedTags: [],
    tags: generateManyTags(100),
  },
};

export const HundredTagsWithSelection: Story = {
  args: {
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
    selectedTags: ['React', 'TypeScript', 'AI', '競馬'],
    tags: generateManyTags(100),
  },
};

export const Empty: Story = {
  args: {
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
    selectedTags: [],
    tags: [],
  },
};

export const SingleTag: Story = {
  args: {
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
    selectedTags: [],
    tags: [{ tag: 'React', count: 10 }],
  },
};
