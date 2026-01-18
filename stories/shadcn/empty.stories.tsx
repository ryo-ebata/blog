import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/atoms';
import type { Meta, StoryObj } from '@storybook/react';

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Arrow icon"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const AlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-muted-foreground"
    role="img"
    aria-label="Alert icon"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6" />
    <path d="M12 16h.01" />
  </svg>
);

const DefaultEmptyHeader = () => (
  <EmptyHeader>
    <EmptyTitle>No items found</EmptyTitle>
    <EmptyDescription>
      There are no items to display. Try adjusting your filters or create a new item.
    </EmptyDescription>
  </EmptyHeader>
);

const IconEmptyHeader = () => (
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <ArrowIcon />
    </EmptyMedia>
    <EmptyTitle>No items found</EmptyTitle>
    <EmptyDescription>
      There are no items to display. Try adjusting your filters or create a new item.
    </EmptyDescription>
  </EmptyHeader>
);

const ProjectEmptyHeader = () => (
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <ArrowIcon />
    </EmptyMedia>
    <EmptyTitle>No projects yet</EmptyTitle>
    <EmptyDescription>
      You haven&apos;t created any projects yet. Get started by creating your first project.
    </EmptyDescription>
  </EmptyHeader>
);

const ProjectActionButtons = () => (
  <div className="flex gap-2">
    <Button>Create Project</Button>
    <Button variant="outline">Import Project</Button>
  </div>
);

const ErrorEmptyHeader = () => (
  <EmptyHeader>
    <EmptyMedia variant="default">
      <AlertIcon />
    </EmptyMedia>
    <EmptyTitle>Something went wrong</EmptyTitle>
    <EmptyDescription>
      We encountered an error while loading your data. Please try again later.
    </EmptyDescription>
  </EmptyHeader>
);

const meta = {
  component: Empty,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'shadcn/Empty',
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Empty>
      <DefaultEmptyHeader />
    </Empty>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Empty>
      <IconEmptyHeader />
    </Empty>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Empty>
      <IconEmptyHeader />
      <EmptyContent>
        <Button>Create Item</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const WithMultipleActions: Story = {
  render: () => (
    <Empty>
      <ProjectEmptyHeader />
      <EmptyContent>
        <ProjectActionButtons />
      </EmptyContent>
    </Empty>
  ),
};

export const CustomMedia: Story = {
  render: () => (
    <Empty>
      <ErrorEmptyHeader />
      <EmptyContent>
        <Button variant="outline">Retry</Button>
      </EmptyContent>
    </Empty>
  ),
};
