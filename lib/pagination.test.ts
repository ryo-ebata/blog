import { describe, expect, it } from 'vitest';
import { paginateItems } from './pagination';

describe('paginateItems', () => {
  const items = Array.from({ length: 25 }, (_, i) => `item-${i + 1}`);

  it('指定ページのアイテムを正しく分割する', () => {
    const result = paginateItems(items, 1, 10);
    expect(result.items).toHaveLength(10);
    expect(result.items[0]).toBe('item-1');
    expect(result.totalPages).toBe(3);
    expect(result.totalItems).toBe(25);
    expect(result.currentPage).toBe(1);
  });

  it('2ページ目のアイテムを返す', () => {
    const result = paginateItems(items, 2, 10);
    expect(result.items[0]).toBe('item-11');
    expect(result.items).toHaveLength(10);
  });

  it('最終ページの残りアイテムを返す', () => {
    const result = paginateItems(items, 3, 10);
    expect(result.items).toHaveLength(5);
    expect(result.items[0]).toBe('item-21');
  });

  it('空配列の場合は空を返す', () => {
    const result = paginateItems([], 1, 10);
    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(0);
    expect(result.totalItems).toBe(0);
  });

  it('1ページに収まる場合は全アイテムを返す', () => {
    const shortItems = ['a', 'b', 'c'];
    const result = paginateItems(shortItems, 1, 10);
    expect(result.items).toEqual(['a', 'b', 'c']);
    expect(result.totalPages).toBe(1);
  });

  it('範囲外のページ番号をクランプする（大きすぎる場合）', () => {
    const result = paginateItems(items, 100, 10);
    expect(result.currentPage).toBe(3);
  });

  it('範囲外のページ番号をクランプする（0以下の場合）', () => {
    const result = paginateItems(items, 0, 10);
    expect(result.currentPage).toBe(1);
  });
});
