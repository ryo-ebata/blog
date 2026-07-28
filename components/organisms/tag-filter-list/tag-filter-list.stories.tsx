import type { Meta, StoryObj } from '@storybook/react';
import { TagFilterList } from './tag-filter-list';

const meta = {
  component: TagFilterList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'elements/TagFilterList',
} satisfies Meta<typeof TagFilterList>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = [
  { count: 12, tag: 'React' },
  { count: 8, tag: 'TypeScript' },
  { count: 5, tag: 'Next.js' },
  { count: 2, tag: 'CSS' },
];

export const Default: Story = {
  args: {
    onTagToggle: () => {},
    selectedTags: [],
    tags,
  },
};

export const WithSelection: Story = {
  args: {
    onTagToggle: () => {},
    selectedTags: ['React', 'Next.js'],
    tags,
  },
};
