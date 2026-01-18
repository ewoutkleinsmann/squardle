# Phase 1: Core Game Logic - Code Examples (Part 2)

## 1.4 Path Validator Module

**File**: `src/game/pathValidator.ts`

```typescript
import { Path, Grid, Position } from './types';
import { isValidPosition } from './grid';
import { areNeighbors, isPositionInPath } from './neighbors';

export interface PathValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePath(grid: Grid, path: Path): PathValidationResult {
  if (path.length === 0) return { isValid: true };

  if (!isValidPosition(grid, path[0])) {
    return { isValid: false, error: 'First position out of bounds' };
  }

  const visited = new Set<string>();
  visited.add(`${path[0].row},${path[0].col}`);

  for (let i = 1; i < path.length; i++) {
    const current = path[i];
    const previous = path[i - 1];

    if (!isValidPosition(grid, current)) {
      return { isValid: false, error: `Position ${i} out of bounds` };
    }
    if (!areNeighbors(previous, current)) {
      return { isValid: false, error: `Positions ${i - 1} and ${i} are not neighbors` };
    }
    const key = `${current.row},${current.col}`;
    if (visited.has(key)) {
      return { isValid: false, error: `Position ${i} already used` };
    }
    visited.add(key);
  }
  return { isValid: true };
}

export function canAddToPath(grid: Grid, currentPath: Path, newPosition: Position): boolean {
  if (!isValidPosition(grid, newPosition)) return false;
  if (currentPath.length === 0) return true;
  const last = currentPath[currentPath.length - 1];
  if (!areNeighbors(last, newPosition)) return false;
  if (isPositionInPath(currentPath, newPosition)) return false;
  return true;
}
```

**File**: `src/game/__tests__/pathValidator.test.ts`

```typescript
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

    it('returns invalid for out of bounds', () => {
      expect(validatePath(grid, [{ row: -1, col: 0 }]).isValid).toBe(false);
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
      expect(canAddToPath(grid, [{ row: 0, col: 0 }], { row: 0, col: 0 })).toBe(false);
    });
  });
});
```

---

## 1.5 Word Validator Module

**File**: `src/game/wordValidator.ts`

```typescript
import { words } from '../words';

let wordSet: Set<string> | null = null;

function getWordSet(): Set<string> {
  if (!wordSet) {
    wordSet = new Set(words.map((w) => w.toUpperCase()));
  }
  return wordSet;
}

export function isValidWord(word: string): boolean {
  return getWordSet().has(word.toUpperCase());
}

export function meetsLengthRequirement(
  word: string,
  minLength: number,
  maxLength: number = Infinity
): boolean {
  return word.length >= minLength && word.length <= maxLength;
}
```

**File**: `src/game/__tests__/wordValidator.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { isValidWord, meetsLengthRequirement } from '../wordValidator';

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
});
```

---

## 1.6 Scoring Module

**File**: `src/game/scoring.ts`

```typescript
import { FoundWord } from './types';

// Fibonacci: 4=5, 5=8, 6=13, 7=21, 8=34...
const SCORING_TABLE = [5, 8, 13, 21, 34, 55, 89, 144, 233, 377];

export function calculateWordScore(wordLength: number, minLength: number = 4): number {
  const index = wordLength - minLength;
  if (index < 0) return 0;
  return SCORING_TABLE[Math.min(index, SCORING_TABLE.length - 1)];
}

export function calculateTotalScore(foundWords: FoundWord[]): number {
  return foundWords.reduce((sum, fw) => sum + fw.points, 0);
}
```

**File**: `src/game/__tests__/scoring.test.ts`

```typescript
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
```

---

## 1.7 Word Finder Module

**File**: `src/game/wordFinder.ts`

```typescript
import { Grid, Position, Path } from './types';
import { getLetterAt, getWordFromPath } from './grid';
import { getNeighbors, isPositionInPath } from './neighbors';
import { isValidWord, meetsLengthRequirement } from './wordValidator';

export interface WordFinderConfig {
  minWordLength: number;
  maxWordLength: number;
}

const DEFAULT_CONFIG: WordFinderConfig = { minWordLength: 4, maxWordLength: 15 };

export function findAllWords(grid: Grid, config = DEFAULT_CONFIG): string[] {
  const foundWords = new Set<string>();

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      dfs(grid, [{ row, col }], foundWords, config);
    }
  }
  return Array.from(foundWords).sort();
}

function dfs(grid: Grid, path: Path, found: Set<string>, config: WordFinderConfig): void {
  const word = getWordFromPath(grid, path);
  if (word.length > config.maxWordLength) return;

  if (meetsLengthRequirement(word, config.minWordLength) && isValidWord(word)) {
    found.add(word);
  }

  const last = path[path.length - 1];
  for (const neighbor of getNeighbors(grid, last)) {
    if (!isPositionInPath(path, neighbor)) {
      dfs(grid, [...path, neighbor], found, config);
    }
  }
}

export function findWordInGrid(grid: Grid, word: string): Path | null {
  const target = word.toUpperCase();
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      if (getLetterAt(grid, { row, col }) === target[0]) {
        const result = findWordDFS(grid, target, [{ row, col }]);
        if (result) return result;
      }
    }
  }
  return null;
}

function findWordDFS(grid: Grid, target: string, path: Path): Path | null {
  const current = getWordFromPath(grid, path);
  if (current === target) return path;
  if (!target.startsWith(current)) return null;

  const last = path[path.length - 1];
  const nextLetter = target[path.length];
  for (const neighbor of getNeighbors(grid, last)) {
    if (!isPositionInPath(path, neighbor) && getLetterAt(grid, neighbor) === nextLetter) {
      const result = findWordDFS(grid, target, [...path, neighbor]);
      if (result) return result;
    }
  }
  return null;
}

export function countWordsInGrid(grid: Grid, config = DEFAULT_CONFIG): number {
  return findAllWords(grid, config).length;
}
```

---

## 1.8 Grid Generator Module

**File**: `src/game/gridGenerator.ts`

```typescript
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
    let grid = fillGridWithRandomLetters(createEmptyGrid(config.rows, config.cols));
    const words = findAllWords(grid, { minWordLength: config.minWordLength, maxWordLength: config.maxWordLength });
    if (words.length >= config.minWords) return { grid, validWords: words };
  }
  const grid = fillGridWithRandomLetters(createEmptyGrid(config.rows, config.cols));
  return { grid, validWords: findAllWords(grid, { minWordLength: config.minWordLength, maxWordLength: config.maxWordLength }) };
}
```
