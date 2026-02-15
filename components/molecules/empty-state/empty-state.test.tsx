import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('タイトルを表示する', () => {
    render(<EmptyState />);
    expect(screen.getByText('No Projects Yet')).toBeInTheDocument();
  });

  it('説明文を表示する', () => {
    render(<EmptyState />);
    expect(screen.getByText(/You haven't created any projects yet/)).toBeInTheDocument();
  });

  it('アクションボタンを表示する', () => {
    render(<EmptyState />);
    expect(screen.getByText('Create Project')).toBeInTheDocument();
    expect(screen.getByText('Import Project')).toBeInTheDocument();
  });

  it('Learn Moreリンクを表示する', () => {
    render(<EmptyState />);
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });
});
