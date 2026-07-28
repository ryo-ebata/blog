import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BuyMeACoffee } from './buy-me-a-coffee';

describe('BuyMeACoffee', () => {
  it('見出しテキストを表示する', () => {
    render(<BuyMeACoffee />);
    expect(screen.getByText('コーヒーで応援する')).toBeInTheDocument();
  });

  it('Buy Me a Coffeeのscript要素をDOMに追加する', () => {
    const { container } = render(<BuyMeACoffee />);
    const script = container.querySelector('script[data-name="bmc-button"]');

    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute(
      'src',
      'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js'
    );
    expect(script).toHaveAttribute('data-slug', 'ryoebata');
  });
});
