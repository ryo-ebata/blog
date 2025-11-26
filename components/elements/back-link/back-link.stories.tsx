import type { Meta, StoryObj } from '@storybook/react';
import { BackLink } from './back-link';

const meta = {
  title: 'elements/BackLink',
  component: BackLink,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
      description: 'リンク先のURL',
    },
    label: {
      control: 'text',
      description: '表示するラベル',
    },
  },
} satisfies Meta<typeof BackLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '/blog',
    label: '← ブログ一覧に戻る',
  },
};

export const CustomLabel: Story = {
  args: {
    href: '/',
    label: '← ホームに戻る',
  },
};

export const CustomHref: Story = {
  args: {
    href: '/about',
    label: '← 戻る',
  },
};
