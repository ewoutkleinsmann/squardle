import { describe, it, expect } from 'vitest';
import { createEmptyGrid } from '../grid';
import { getNeighbors, areNeighbors, isPositionInPath } from '../neighbors';

describe('neighbors', () => {
  describe('getNeighbors', () => {
    const grid = createEmptyGrid(5, 5);

    it('returns 8 neighbors for center cell', () => {
      expect(getNeighbors(grid, { row: 2, col: 2 })).toHaveLength(8);
    });

    it('returns 3 neighbors for corner cell', () => {
      expect(getNeighbors(grid, { row: 0, col: 0 })).toHaveLength(3);
    });

    it('returns 5 neighbors for edge cell', () => {
      expect(getNeighbors(grid, { row: 0, col: 2 })).toHaveLength(5);
    });
  });

  describe('areNeighbors', () => {
    it('returns true for horizontal neighbors', () => {
      expect(areNeighbors({ row: 1, col: 1 }, { row: 1, col: 2 })).toBe(true);
    });

    it('returns true for diagonal neighbors', () => {
      expect(areNeighbors({ row: 1, col: 1 }, { row: 2, col: 2 })).toBe(true);
    });

    it('returns false for same position', () => {
      expect(areNeighbors({ row: 1, col: 1 }, { row: 1, col: 1 })).toBe(false);
    });

    it('returns false for non-adjacent', () => {
      expect(areNeighbors({ row: 0, col: 0 }, { row: 2, col: 2 })).toBe(false);
    });
  });

  describe('isPositionInPath', () => {
    const path = [{ row: 0, col: 0 }, { row: 0, col: 1 }];

    it('returns true when present', () => {
      expect(isPositionInPath(path, { row: 0, col: 0 })).toBe(true);
    });

    it('returns false when absent', () => {
      expect(isPositionInPath(path, { row: 1, col: 1 })).toBe(false);
    });
  });
});
