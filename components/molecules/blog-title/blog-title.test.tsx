import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlogTitle } from './blog-title';

describe('BlogTitle', () => {
  it('指定したタイトルを表示する', () => {
    render(<BlogTitle title="テストタイトル" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('テストタイトル');
  });

  it('タイトル未指定時にデフォルトタイトルを表示する', () => {
    render(<BlogTitle />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('ブログ');
  });
});
