import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './empty-state';

const meta = {
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'elements/EmptyState',
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
