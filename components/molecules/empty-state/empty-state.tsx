'use client';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/atoms/empty';
import { ArrowUpRightIcon } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { IconFolderCode } from '@tabler/icons-react';
import Link from 'next/link';

const EmptyMediaIcon = () => (
  <EmptyMedia variant="icon">
    <IconFolderCode />
  </EmptyMedia>
);

const ActionButtons = () => (
  <div className="flex gap-2">
    <Button>Create Project</Button>
    <Button variant="outline">Import Project</Button>
  </div>
);

const EmptyStateHeader = () => (
  <EmptyHeader>
    <EmptyMediaIcon />
    <EmptyTitle>No Projects Yet</EmptyTitle>
    <EmptyDescription>
      You haven&apos;t created any projects yet. Get started by creating your first project.
    </EmptyDescription>
  </EmptyHeader>
);

const EmptyStateContent = () => (
  <EmptyContent>
    <ActionButtons />
  </EmptyContent>
);

export const EmptyState = () => (
  <Empty>
    <EmptyStateHeader />
    <EmptyStateContent />
    <Button variant="link" render={<Link href="#" />} className="text-muted-foreground" size="sm">
      Learn More <ArrowUpRightIcon />
    </Button>
  </Empty>
);
