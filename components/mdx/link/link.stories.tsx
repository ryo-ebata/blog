import type { Meta, StoryObj } from '@storybook/react';
import { MdxLink } from './link';

const meta = {
  title: 'mdx/Link',
  component: MdxLink,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
      description: 'リンク先のURL',
    },
    children: {
      control: 'text',
      description: 'リンクのテキスト',
    },
  },
} satisfies Meta<typeof MdxLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '/blog',
    children: 'ブログ一覧',
  },
};

export const ExternalLink: Story = {
  args: {
    href: 'https://nextjs.org',
    children: 'Next.js公式サイト',
  },
};

export const InParagraph: Story = {
  args: {
    href: '#',
  },
  render: () => (
    <p>
      これは通常のテキストです。
      <MdxLink href="/blog">ブログ一覧</MdxLink>
      へのリンクが含まれています。
    </p>
  ),
};

export const MultipleLinks: Story = {
  args: {
    href: '#',
  },
  render: () => (
    <div className="space-y-2">
      <p>
        <MdxLink href="/">ホーム</MdxLink>
      </p>
      <p>
        <MdxLink href="/blog">ブログ一覧</MdxLink>
      </p>
      <p>
        <MdxLink href="https://nextjs.org">Next.js公式サイト</MdxLink>
      </p>
    </div>
  ),
};
