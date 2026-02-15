import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TagList } from '../tag-list';

describe('TagList', () => {
  it('タグのリストをレンダリングする', () => {
    render(<TagList tags={['React', 'TypeScript']} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('各タグがリンクとしてレンダリングされる', () => {
    render(<TagList tags={['React']} />);
    const link = screen.getByRole('link', { name: 'React' });
    expect(link).toHaveAttribute('href', '/blog?tags=React');
  });

  it('空配列の場合何もレンダリングしない', () => {
    const { container } = render(<TagList tags={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('タグ名をURLエンコードする', () => {
    render(<TagList tags={['C++']} />);
    const link = screen.getByRole('link', { name: 'C++' });
    expect(link).toHaveAttribute('href', '/blog?tags=C%2B%2B');
  });
});
