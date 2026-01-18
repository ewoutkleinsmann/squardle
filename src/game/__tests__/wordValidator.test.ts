import { describe, it, expect } from 'vitest';
import { isValidWord, meetsLengthRequirement, isValidPrefix } from '../wordValidator';

describe('wordValidator', () => {
  describe('isValidWord', () => {
    it('returns true for valid word', () => {
      expect(isValidWord('WORD')).toBe(true);
    });

    it('returns true for lowercase input', () => {
      expect(isValidWord('word')).toBe(true);
    });

    it('returns false for invalid word', () => {
      expect(isValidWord('XYZABC')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidWord('')).toBe(false);
    });
  });

  describe('meetsLengthRequirement', () => {
    it('returns true for word within range', () => {
      expect(meetsLengthRequirement('WORD', 4, 10)).toBe(true);
    });

    it('returns false for short word', () => {
      expect(meetsLengthRequirement('CAT', 4)).toBe(false);
    });
  });

  describe('isValidPrefix', () => {
    it('returns true for valid prefix', () => {
      expect(isValidPrefix('WO')).toBe(true); // WORD
      expect(isValidPrefix('APP')).toBe(true); // APPLE
    });

    it('returns false for invalid prefix', () => {
      expect(isValidPrefix('XYZ')).toBe(false);
      expect(isValidPrefix('ZZZ')).toBe(false);
    });

    it('returns true for empty string', () => {
      expect(isValidPrefix('')).toBe(true);
    });

    it('is case insensitive', () => {
        expect(isValidPrefix('wo')).toBe(true);
    });
  });
});
