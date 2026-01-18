import { describe, it, expect } from 'vitest';
import {
  createEmptyGrid,
  createGridFromLetters,
  getLetterAt,
  isValidPosition,
  getWordFromPath,
} from '../grid';

describe('grid', () => {
  describe('createEmptyGrid', () => {
    it('creates grid with correct dimensions', () => {
      const grid = createEmptyGrid(4, 4);
      expect(grid.rows).toBe(4);
      expect(grid.cols).toBe(4);
      expect(grid.cells.length).toBe(4);
      expect(grid.cells[0].length).toBe(4);
    });

    it('creates cells with empty letters', () => {
      const grid = createEmptyGrid(2, 2);
      grid.cells.forEach(row =>
        row.forEach(cell => expect(cell.letter).toBe(''))
      );
    });

    it('creates cells with correct positions', () => {
      const grid = createEmptyGrid(3, 3);
      expect(grid.cells[1][2].position).toEqual({ row: 1, col: 2 });
    });
  });

  describe('createGridFromLetters', () => {
    it('creates grid from 2D array', () => {
      const grid = createGridFromLetters([['A', 'B'], ['C', 'D']]);
      expect(grid.cells[0][0].letter).toBe('A');
      expect(grid.cells[1][1].letter).toBe('D');
    });

    it('converts to uppercase', () => {
      const grid = createGridFromLetters([['a', 'b']]);
      expect(grid.cells[0][0].letter).toBe('A');
    });

    it('handles empty array', () => {
      const grid = createGridFromLetters([]);
      expect(grid.rows).toBe(0);
      expect(grid.cols).toBe(0);
    });
  });

  describe('getLetterAt', () => {
    const grid = createGridFromLetters([['A', 'B'], ['C', 'D']]);

    it('returns correct letter', () => {
      expect(getLetterAt(grid, { row: 0, col: 1 })).toBe('B');
    });

    it('returns null for invalid position', () => {
      expect(getLetterAt(grid, { row: -1, col: 0 })).toBeNull();
    });
  });

  describe('isValidPosition', () => {
    const grid = createEmptyGrid(4, 4);

    it('returns true for valid positions', () => {
      expect(isValidPosition(grid, { row: 0, col: 0 })).toBe(true);
      expect(isValidPosition(grid, { row: 3, col: 3 })).toBe(true);
    });

    it('returns false for negative positions', () => {
      expect(isValidPosition(grid, { row: -1, col: 0 })).toBe(false);
    });

    it('returns false for out of bounds', () => {
      expect(isValidPosition(grid, { row: 4, col: 0 })).toBe(false);
    });
  });

  describe('getWordFromPath', () => {
    const grid = createGridFromLetters([
      ['C', 'O'],
      ['R', 'E'],
    ]);

    it('returns correct word', () => {
      const path = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
      ];
      expect(getWordFromPath(grid, path)).toBe('COE');
    });

    it('handles empty path', () => {
      expect(getWordFromPath(grid, [])).toBe('');
    });

    it('handles path with invalid position', () => {
      const path = [
        { row: 0, col: 0 },
        { row: -1, col: 0 }, // invalid
        { row: 1, col: 1 },
      ];
      expect(getWordFromPath(grid, path)).toBe('CE');
    });
  });
});
