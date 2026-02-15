import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { BaseContentMetadata } from '@/lib/content';
import { PostHeader } from './post-header';

const createMockMetadata = (overrides: Partial<BaseContentMetadata> = {}): BaseContentMetadata => ({
  slug: 'test-post',
  title: 'テスト記事タイトル',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-02T00:00:00Z',
  ...overrides,
});

describe('PostHeader', () => {
  it('タイトルを表示する', () => {
    render(<PostHeader metadata={createMockMetadata()} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('テスト記事タイトル');
  });

  it('タグを表示する', () => {
    render(<PostHeader metadata={createMockMetadata({ tags: ['React', 'TypeScript'] })} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('文字数を表示する', () => {
    render(<PostHeader metadata={createMockMetadata({ characterCount: 1500 })} />);
    expect(screen.getByText('1500 文字')).toBeInTheDocument();
  });

  it('説明文がある場合に概要セクションを表示する', () => {
    render(<PostHeader metadata={createMockMetadata({ description: 'テスト説明文' })} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('概要');
    expect(screen.getByText('テスト説明文')).toBeInTheDocument();
  });

  it('説明文がない場合に概要セクションを表示しない', () => {
    render(<PostHeader metadata={createMockMetadata()} />);
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });
});
