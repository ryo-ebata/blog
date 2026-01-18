import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Time } from './time';

describe('Time', () => {
  it('日付を正しくフォーマットして表示する', () => {
    render(<Time date="2024-01-15" />);

    const timeElement = screen.getByRole('time');
    expect(timeElement).toBeInTheDocument();
  });

  it('カレンダーアイコンが表示される', () => {
    render(<Time date="2024-01-15" />);

    const timeElement = screen.getByRole('time');
    expect(timeElement.querySelector('svg')).toBeInTheDocument();
  });

  it('適切なスタイルクラスが適用される', () => {
    render(<Time date="2024-01-15" />);

    const timeElement = screen.getByRole('time');
    expect(timeElement).toHaveClass('text-muted-foreground');
  });
});
