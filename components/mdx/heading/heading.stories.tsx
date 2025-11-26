import type { Meta, StoryObj } from '@storybook/react';
import { MdxHeading } from './heading';

const meta = {
  title: 'mdx/Heading',
  component: MdxHeading,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: '見出しのレベル',
    },
    children: {
      control: 'text',
      description: '見出しのテキスト',
    },
  },
} satisfies Meta<typeof MdxHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H1: Story = {
  args: {
    as: 'h1',
    children: '見出し1',
  },
};

export const H2: Story = {
  args: {
    as: 'h2',
    children: '見出し2',
  },
};

export const H3: Story = {
  args: {
    as: 'h3',
    children: '見出し3',
  },
};

export const H4: Story = {
  args: {
    as: 'h4',
    children: '見出し4',
  },
};

export const H5: Story = {
  args: {
    as: 'h5',
    children: '見出し5',
  },
};

export const H6: Story = {
  args: {
    as: 'h6',
    children: '見出し6',
  },
};

export const AllLevels: Story = {
  args: {},
  render: () => (
    <div className="space-y-4">
      <MdxHeading as="h1">見出し1</MdxHeading>
      <MdxHeading as="h2">見出し2</MdxHeading>
      <MdxHeading as="h3">見出し3</MdxHeading>
      <MdxHeading as="h4">見出し4</MdxHeading>
      <MdxHeading as="h5">見出し5</MdxHeading>
      <MdxHeading as="h6">見出し6</MdxHeading>
    </div>
  ),
};

