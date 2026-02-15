import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BackLink } from './back-link';

describe('BackLink', () => {
  it('ラベルを表示する', () => {
    render(<BackLink href="/blog" label="ブログに戻る" />);
    expect(screen.getByText('ブログに戻る')).toBeInTheDocument();
  });

  it('正しいhrefのリンクをレンダリングする', () => {
    render(<BackLink href="/blog" label="ブログに戻る" />);
    const link = screen.getByRole('link', { name: 'ブログに戻る' });
    expect(link).toHaveAttribute('href', '/blog');
  });
});
