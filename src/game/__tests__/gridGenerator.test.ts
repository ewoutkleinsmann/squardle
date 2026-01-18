import { describe, it, expect } from 'vitest';
import { generateRandomLetter, fillGridWithRandomLetters, generateGrid } from '../gridGenerator';
import { createEmptyGrid } from '../grid';

describe('gridGenerator', () => {
  describe('generateRandomLetter', () => {
    it('returns a single uppercase letter', () => {
      const letter = generateRandomLetter();
      expect(letter).toMatch(/^[A-Z]$/);
    });

    it('returns valid letters over many calls', () => {
        for (let i = 0; i < 100; i++) {
            const letter = generateRandomLetter();
            expect(letter).toMatch(/^[A-Z]$/);
        }
    });
  });

  describe('fillGridWithRandomLetters', () => {
    it('fills all cells', () => {
      const grid = createEmptyGrid(4, 4);
      const filled = fillGridWithRandomLetters(grid);
      filled.cells.forEach(row =>
        row.forEach(cell => {
          expect(cell.letter).not.toBe('');
          expect(cell.letter).toMatch(/^[A-Z]$/);
        })
      );
    });
  });

  describe('generateGrid', () => {
    it('generates grid with minimum words', () => {
      // Use lower threshold for test reliability
      const config = { rows: 4, cols: 4, minWords: 1, minWordLength: 3, maxWordLength: 10 };
      const { grid, validWords } = generateGrid(config);
      expect(grid.rows).toBe(4);
      expect(validWords.length).toBeGreaterThanOrEqual(1);
    }, 30000);

    it('returns best effort if max attempts reached', () => {
      // Impossible requirement
      const config = { rows: 2, cols: 2, minWords: 1000, minWordLength: 3, maxWordLength: 10 };
      const { grid, validWords } = generateGrid(config, 2); // 2 attempts
      expect(grid).toBeDefined();
      expect(validWords).toBeDefined();
      // It won't reach 1000 words
      expect(validWords.length).toBeLessThan(1000);
    });
  });
});
