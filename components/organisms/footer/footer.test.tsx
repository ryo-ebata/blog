import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

describe('Footer', () => {
  it('コピーライトテキストを表示する', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025/)).toBeInTheDocument();
  });

  it('サイト名を含む', () => {
    render(<Footer />);
    expect(screen.getByText(/ebaryo\.dev/)).toBeInTheDocument();
  });

  it('footer要素としてレンダリングする', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
