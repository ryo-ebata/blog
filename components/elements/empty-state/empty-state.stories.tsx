import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './empty-state';

const meta = {
  title: 'elements/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
