import { describe, it, expect } from 'vitest';
import { createEmptyGrid } from '../grid';
import { validatePath, canAddToPath } from '../pathValidator';

describe('pathValidator', () => {
  const grid = createEmptyGrid(4, 4);

  describe('validatePath', () => {
    it('returns valid for empty path', () => {
      expect(validatePath(grid, []).isValid).toBe(true);
    });

    it('returns valid for single position', () => {
      expect(validatePath(grid, [{ row: 0, col: 0 }]).isValid).toBe(true);
    });

    it('returns valid for horizontal path', () => {
      const path = [{ row: 0, col: 0 }, { row: 0, col: 1 }];
      expect(validatePath(grid, path).isValid).toBe(true);
    });

    it('returns invalid for out of bounds (first)', () => {
      expect(validatePath(grid, [{ row: -1, col: 0 }]).isValid).toBe(false);
    });

    it('returns invalid for out of bounds (subsequent)', () => {
        const path = [{ row: 0, col: 0 }, { row: -1, col: 0 }];
        expect(validatePath(grid, path).isValid).toBe(false);
    });

    it('returns invalid for non-adjacent', () => {
      const path = [{ row: 0, col: 0 }, { row: 2, col: 2 }];
      expect(validatePath(grid, path).isValid).toBe(false);
    });

    it('returns invalid for repeated position', () => {
      const path = [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 0 }];
      expect(validatePath(grid, path).isValid).toBe(false);
    });
  });

  describe('canAddToPath', () => {
    it('returns true for empty path', () => {
      expect(canAddToPath(grid, [], { row: 0, col: 0 })).toBe(true);
    });

    it('returns true for valid neighbor', () => {
      expect(canAddToPath(grid, [{ row: 0, col: 0 }], { row: 0, col: 1 })).toBe(true);
    });

    it('returns false for non-neighbor', () => {
      expect(canAddToPath(grid, [{ row: 0, col: 0 }], { row: 2, col: 2 })).toBe(false);
    });

    it('returns false for already used', () => {
      // Must be a neighbor to reach the isPositionInPath check
      // (0,0) -> (0,1). Add (0,0). Neighbors? Yes. In path? Yes.
      expect(canAddToPath(grid, [{ row: 0, col: 0 }, { row: 0, col: 1 }], { row: 0, col: 0 })).toBe(false);
    });

    it('returns false for out of bounds', () => {
      expect(canAddToPath(grid, [{ row: 0, col: 0 }], { row: -1, col: 0 })).toBe(false);
    });
  });
});
