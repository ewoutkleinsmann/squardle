import { describe, it, expect } from 'vitest';
import { calculateWordScore, calculateTotalScore } from '../scoring';

describe('scoring', () => {
  describe('calculateWordScore', () => {
    it('4-letter word = 5 points', () => {
      expect(calculateWordScore(4)).toBe(5);
    });

    it('5-letter word = 8 points', () => {
      expect(calculateWordScore(5)).toBe(8);
    });

    it('6-letter word = 13 points', () => {
      expect(calculateWordScore(6)).toBe(13);
    });

    it('7-letter word = 21 points', () => {
      expect(calculateWordScore(7)).toBe(21);
    });

    it('word below min length = 0', () => {
      expect(calculateWordScore(3, 4)).toBe(0);
    });
  });

  describe('calculateTotalScore', () => {
    it('sums all word scores', () => {
      const words = [
        { word: 'WORD', path: [], points: 5 },
        { word: 'HELLO', path: [], points: 8 },
      ];
      expect(calculateTotalScore(words)).toBe(13);
    });
  });
});
