import { Grid, GridConfig } from './types';
import { createEmptyGrid } from './grid';
import { findAllWords } from './wordFinder';

const DEFAULT: GridConfig = { rows: 4, cols: 4, minWords: 20, minWordLength: 4, maxWordLength: 15 };

const WEIGHTS: Record<string, number> = {
  E: 12.7, T: 9.1, A: 8.2, O: 7.5, I: 7.0, N: 6.7, S: 6.3, H: 6.1, R: 6.0,
  D: 4.3, L: 4.0, C: 2.8, U: 2.8, M: 2.4, W: 2.4, F: 2.2, G: 2.0, Y: 2.0,
  P: 1.9, B: 1.5, V: 1.0, K: 0.8, J: 0.2, X: 0.2, Q: 0.1, Z: 0.1,
};

export function generateRandomLetter(): string {
  const total = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [letter, weight] of Object.entries(WEIGHTS)) {
    r -= weight;
    if (r <= 0) return letter;
  }
  /* v8 ignore next */
  return 'E';
}

export function fillGridWithRandomLetters(grid: Grid): Grid {
  return {
    ...grid,
    cells: grid.cells.map((row) =>
      row.map((cell) => ({ ...cell, letter: generateRandomLetter() }))
    ),
  };
}

export function generateGrid(config = DEFAULT, maxAttempts = 100): { grid: Grid; validWords: string[] } {
  for (let i = 0; i < maxAttempts; i++) {
    const grid = fillGridWithRandomLetters(createEmptyGrid(config.rows, config.cols));
    const words = findAllWords(grid, { minWordLength: config.minWordLength, maxWordLength: config.maxWordLength });
    if (words.length >= config.minWords) return { grid, validWords: words };
  }
  const grid = fillGridWithRandomLetters(createEmptyGrid(config.rows, config.cols));
  return { grid, validWords: findAllWords(grid, { minWordLength: config.minWordLength, maxWordLength: config.maxWordLength }) };
}
