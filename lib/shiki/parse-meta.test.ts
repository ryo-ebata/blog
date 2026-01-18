/* oxlint-disable no-magic-numbers -- テストファイルのため期待値としてのマジックナンバーは許容 */
import { describe, expect, it } from 'vitest';

import { parseMeta } from './parse-meta';

describe('parseMeta', () => {
  describe('title', () => {
    it('title="filename.ts"を解析する', () => {
      const result = parseMeta('title="filename.ts"');
      expect(result.title).toBe('filename.ts');
    });

    it("title='filename.ts'を解析する（シングルクォート）", () => {
      const result = parseMeta("title='filename.ts'");
      expect(result.title).toBe('filename.ts');
    });

    it('タイトルなしの場合はundefined', () => {
      const result = parseMeta('showLineNumbers');
      expect(result.title).toBeUndefined();
    });
  });

  describe('showLineNumbers', () => {
    it('showLineNumbersがあればtrue', () => {
      const result = parseMeta('showLineNumbers');
      expect(result.showLineNumbers).toBe(true);
    });

    it('showLineNumbersがなければfalse', () => {
      const result = parseMeta('title="app.ts"');
      expect(result.showLineNumbers).toBe(false);
    });
  });

  describe('highlightLines', () => {
    it('{1}を解析する', () => {
      const result = parseMeta('{1}');
      expect(result.highlightLines).toEqual([1]);
    });

    it('{1,3,5}を解析する', () => {
      const result = parseMeta('{1,3,5}');
      expect(result.highlightLines).toEqual([1, 3, 5]);
    });

    it('{1-3}を解析する（範囲指定）', () => {
      const result = parseMeta('{1-3}');
      expect(result.highlightLines).toEqual([1, 2, 3]);
    });

    it('{1,3-5,8}を解析する（混合）', () => {
      const result = parseMeta('{1,3-5,8}');
      expect(result.highlightLines).toEqual([1, 3, 4, 5, 8]);
    });

    it('ハイライト指定がなければ空配列', () => {
      const result = parseMeta('showLineNumbers');
      expect(result.highlightLines).toEqual([]);
    });
  });

  describe('複合パターン', () => {
    it('title="app.ts" showLineNumbers {1,3-5}を解析する', () => {
      const result = parseMeta('title="app.ts" showLineNumbers {1,3-5}');
      expect(result.title).toBe('app.ts');
      expect(result.showLineNumbers).toBe(true);
      expect(result.highlightLines).toEqual([1, 3, 4, 5]);
    });

    it('undefinedを渡した場合', () => {
      const result = parseMeta(undefined);
      expect(result.title).toBeUndefined();
      expect(result.showLineNumbers).toBe(false);
      expect(result.highlightLines).toEqual([]);
    });

    it('空文字を渡した場合', () => {
      const result = parseMeta('');
      expect(result.title).toBeUndefined();
      expect(result.showLineNumbers).toBe(false);
      expect(result.highlightLines).toEqual([]);
    });
  });
});
