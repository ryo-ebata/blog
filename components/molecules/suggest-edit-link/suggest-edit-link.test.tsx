import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuggestEditLink } from './suggest-edit-link';

describe('SuggestEditLink', () => {
  it('リンクを表示する', () => {
    render(<SuggestEditLink slug="test-post" title="テスト記事" />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('GitHubへのリンクを持つ', () => {
    render(<SuggestEditLink slug="test-post" title="テスト記事" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', expect.stringContaining('github.com'));
  });

  it('新しいタブで開く', () => {
    render(<SuggestEditLink slug="test-post" title="テスト記事" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
