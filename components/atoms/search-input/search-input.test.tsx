import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchInput } from './search-input';

describe('SearchInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('検索入力フィールドをレンダリングする', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', '本文・タグも検索...');
  });

  it('初期値を表示する', () => {
    render(<SearchInput value="テスト検索" onChange={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('テスト検索');
  });

  it('入力変更時にonChangeが呼ばれる', () => {
    const handleChange = vi.fn();
    render(<SearchInput value="" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'React' } });

    expect(handleChange).toHaveBeenCalledWith('React');
  });

  it('検索アイコンが表示される', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);

    const searchIcon = screen.getByTestId('search-icon');
    expect(searchIcon).toBeInTheDocument();
  });

  it('カスタムプレースホルダーを設定できる', () => {
    render(<SearchInput value="" onChange={vi.fn()} placeholder="カスタム検索" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'カスタム検索');
  });

  it('クリアボタンが値がある場合のみ表示される', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /クリア/i })).not.toBeInTheDocument();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'テスト' } });

    expect(screen.getByRole('button', { name: /クリア/i })).toBeInTheDocument();
  });

  it('クリアボタンをクリックすると空文字でonChangeが呼ばれる', () => {
    const handleChange = vi.fn();
    render(<SearchInput value="テスト" onChange={handleChange} />);

    const clearButton = screen.getByRole('button', { name: /クリア/i });
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith('');
  });
});
