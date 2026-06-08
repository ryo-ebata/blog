import { describe, expect, it } from 'vitest';
import { OG_IMAGE_SIZE } from './og-params';

describe('OG_IMAGE_SIZE', () => {
  it('幅が1200pxである', () => {
    expect(OG_IMAGE_SIZE.width).toBe(1200);
  });

  it('高さが630pxである', () => {
    expect(OG_IMAGE_SIZE.height).toBe(630);
  });
});
