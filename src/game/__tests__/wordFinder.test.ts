import { describe, it, expect } from 'vitest';
import { createGridFromLetters } from '../grid';
import { findAllWords, findWordInGrid, countWordsInGrid } from '../wordFinder';

describe('wordFinder', () => {
  const grid = createGridFromLetters([
    ['C', 'A', 'T', 'S'],
    ['O', 'R', 'E', 'X'],
    ['W', 'O', 'R', 'D'],
    ['S', 'E', 'A', 'T'],
  ]);

  describe('findAllWords', () => {
    it('finds words in the grid', () => {
      const words = findAllWords(grid, { minWordLength: 3, maxWordLength: 5 });
      expect(words).toContain('CAT');
      expect(words).toContain('WORD');
      expect(words).toContain('SEAT');
    });

    it('respects min length', () => {
      const words = findAllWords(grid, { minWordLength: 4, maxWordLength: 5 });
      expect(words).not.toContain('CAT'); // 3 letters
      expect(words).toContain('WORD');
    });
  });

  describe('findWordInGrid', () => {
    it('returns path for existing word', () => {
      const path = findWordInGrid(grid, 'CAT');
      expect(path).not.toBeNull();
      expect(path?.length).toBe(3);
      expect(path![0]).toEqual({ row: 0, col: 0 });
      expect(path![1]).toEqual({ row: 0, col: 1 });
      expect(path![2]).toEqual({ row: 0, col: 2 });
    });

    it('returns null for missing word', () => {
      expect(findWordInGrid(grid, 'MISSING')).toBeNull();
    });

    it('backtracks when path is dead end', () => {
        // Grid where T has two 'O' neighbors.
        // O(0,2) is a dead end. O(1,2) leads to P.
        // S T O X
        // X X O X
        // X X P X
        const branchGrid = createGridFromLetters([
            ['S', 'T', 'O', 'X'],
            ['X', 'X', 'O', 'X'],
            ['X', 'X', 'P', 'X'],
        ]);
        const path = findWordInGrid(branchGrid, 'STOP');
        expect(path).not.toBeNull();
        expect(path).toHaveLength(4);
        expect(path![2]).toEqual({ row: 1, col: 2 }); // O(1,2)
        expect(path![3]).toEqual({ row: 2, col: 2 }); // P(2,2)
    });

    it('finds word when multiple starting points exist', () => {
        // S X X
        // X X X
        // S O N
        // First S(0,0) is isolated.
        // Second S(2,0) has O(2,1) -> N(2,2).
        const multiStartGrid = createGridFromLetters([
            ['S', 'X', 'X'],
            ['X', 'X', 'X'],
            ['S', 'O', 'N'],
        ]);
        const path = findWordInGrid(multiStartGrid, 'SON');
        expect(path).not.toBeNull();
        expect(path![0]).toEqual({ row: 2, col: 0 });
    });
  });

  describe('countWordsInGrid', () => {
    it('counts words correctly', () => {
        const count = countWordsInGrid(grid, { minWordLength: 3, maxWordLength: 5 });
        const words = findAllWords(grid, { minWordLength: 3, maxWordLength: 5 });
        expect(count).toBe(words.length);
        expect(count).toBeGreaterThan(0);
    });

    it('uses default config', () => {
        const count = countWordsInGrid(grid);
        expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
