import { describe, expect, it } from 'vitest';
import { isFuturePost } from './posts';

describe('isFuturePost', () => {
  const today = new Date('2025-01-06T12:00:00');

  describe('未来日付の判定', () => {
    it('createdAtが未来日付の場合、trueを返す', () => {
      expect(isFuturePost('2025-01-07', '2025-01-06', today)).toBe(true);
    });

    it('updatedAtが未来日付の場合、trueを返す', () => {
      expect(isFuturePost('2025-01-06', '2025-01-07', today)).toBe(true);
    });

    it('createdAtとupdatedAtの両方が未来日付の場合、trueを返す', () => {
      expect(isFuturePost('2025-01-07', '2025-01-08', today)).toBe(true);
    });

    it('createdAtとupdatedAtのどちらかが未来日付の場合、trueを返す', () => {
      expect(isFuturePost('2025-01-07', '2025-01-05', today)).toBe(true);
      expect(isFuturePost('2025-01-05', '2025-01-07', today)).toBe(true);
    });
  });

  describe('過去日付の判定', () => {
    it('createdAtとupdatedAtの両方が過去日付の場合、falseを返す', () => {
      expect(isFuturePost('2025-01-05', '2025-01-05', today)).toBe(false);
    });

    it('createdAtが過去日付、updatedAtが当日の場合、falseを返す', () => {
      expect(isFuturePost('2025-01-05', '2025-01-06', today)).toBe(false);
    });
  });

  describe('当日の判定（時刻を無視）', () => {
    it('createdAtが当日の場合、falseを返す（表示する）', () => {
      expect(isFuturePost('2025-01-06', '2025-01-05', today)).toBe(false);
    });

    it('updatedAtが当日の場合、falseを返す（表示する）', () => {
      expect(isFuturePost('2025-01-05', '2025-01-06', today)).toBe(false);
    });

    it('createdAtとupdatedAtの両方が当日の場合、falseを返す（表示する）', () => {
      expect(isFuturePost('2025-01-06', '2025-01-06', today)).toBe(false);
    });

    it('時刻が異なっても同じ日付ならfalseを返す', () => {
      /*
       * 現在時刻は 2025-01-06 12:00:00
       * 同じ日付でも時刻が異なる場合でも、日付のみで比較する
       */
      expect(isFuturePost('2025-01-06', '2025-01-06', today)).toBe(false);
    });
  });

  describe('境界値のテスト', () => {
    it('1日前はfalseを返す', () => {
      expect(isFuturePost('2025-01-05', '2025-01-05', today)).toBe(false);
    });

    it('1日後はtrueを返す', () => {
      expect(isFuturePost('2025-01-07', '2025-01-07', today)).toBe(true);
    });

    it('当日はfalseを返す', () => {
      expect(isFuturePost('2025-01-06', '2025-01-06', today)).toBe(false);
    });
  });

  describe('異なる形式の日付文字列', () => {
    it('ISO形式の日付文字列でも正しく判定する', () => {
      expect(isFuturePost('2025-01-07T00:00:00Z', '2025-01-06', today)).toBe(true);
      expect(isFuturePost('2025-01-06', '2025-01-07T00:00:00Z', today)).toBe(true);
    });
  });
});
