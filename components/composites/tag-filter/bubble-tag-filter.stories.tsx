import type { Meta, StoryObj } from '@storybook/react';
import type { TagCount } from '@/lib/tags';
import { BubbleTagFilter } from './bubble-tag-filter';

const meta = {
  title: 'composites/BubbleTagFilter',
  component: BubbleTagFilter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
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
    tag,
    count: Math.max(1, Math.floor(100 / (index + 1))),
  }));
};

const fewTags: TagCount[] = [
  { tag: 'React', count: 15 },
  { tag: 'TypeScript', count: 12 },
  { tag: 'Next.js', count: 8 },
  { tag: '競馬', count: 3 },
  { tag: '雑記', count: 2 },
];

export const Default: Story = {
  args: {
    tags: fewTags,
    selectedTags: [],
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
  },
};

export const WithSelectedTags: Story = {
  args: {
    tags: fewTags,
    selectedTags: ['React', '競馬'],
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
  },
};

export const ManyTags: Story = {
  args: {
    tags: generateManyTags(30),
    selectedTags: [],
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
  },
};

export const HundredTags: Story = {
  args: {
    tags: generateManyTags(100),
    selectedTags: [],
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
  },
};

export const HundredTagsWithSelection: Story = {
  args: {
    tags: generateManyTags(100),
    selectedTags: ['React', 'TypeScript', 'AI', '競馬'],
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
  },
};

export const Empty: Story = {
  args: {
    tags: [],
    selectedTags: [],
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
  },
};

export const SingleTag: Story = {
  args: {
    tags: [{ tag: 'React', count: 10 }],
    selectedTags: [],
    onTagToggle: (tag: string) => console.log('Toggle:', tag),
  },
};
