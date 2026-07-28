import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TagFilterList } from './tag-filter-list';

const tags = [
  { tag: 'React', count: 3 },
  { tag: 'TypeScript', count: 1 },
];

describe('TagFilterList', () => {
  it('タグとその件数を表示する', () => {
    render(<TagFilterList tags={tags} selectedTags={[]} onTagToggle={vi.fn()} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('選択中のタグに aria-pressed="true" を付与する', () => {
    render(<TagFilterList tags={tags} selectedTags={['React']} onTagToggle={vi.fn()} />);
    expect(screen.getByRole('button', { name: /React/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /TypeScript/ })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('タグをクリックすると onTagToggle が呼ばれる', () => {
    const handleToggle = vi.fn();
    render(<TagFilterList tags={tags} selectedTags={[]} onTagToggle={handleToggle} />);

    fireEvent.click(screen.getByRole('button', { name: /React/ }));

    expect(handleToggle).toHaveBeenCalledWith('React');
  });

  it('空配列の場合何もレンダリングしない', () => {
    const { container } = render(
      <TagFilterList tags={[]} selectedTags={[]} onTagToggle={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });
});
