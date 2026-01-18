# Phase 1: Core Game Logic - Code Examples

## 1.1 Types Module

**File**: `src/game/types.ts`

```typescript
/** Position on the grid */
export interface Position {
  row: number;
  col: number;
}

/** A single cell in the grid */
export interface Cell {
  letter: string;
  position: Position;
}

/** The game grid */
export interface Grid {
  cells: Cell[][];
  rows: number;
  cols: number;
}

/** A path through the grid (sequence of positions) */
export type Path = Position[];

/** State of a found word */
export interface FoundWord {
  word: string;
  path: Path;
  points: number;
}

/** Complete game state */
export interface GameState {
  grid: Grid;
  foundWords: FoundWord[];
  allValidWords: string[];
  currentPath: Path;
  isSelecting: boolean;
  score: number;
}

/** Configuration for grid generation */
export interface GridConfig {
  rows: number;
  cols: number;
  minWords: number;
  minWordLength: number;
  maxWordLength: number;
}
```

---

## 1.2 Grid Module

**File**: `src/game/grid.ts`

```typescript
import { Grid, Cell, Position } from './types';

/**
 * Creates an empty grid of the specified dimensions
 */
export function createEmptyGrid(rows: number, cols: number): Grid {
  const cells: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    cells[row] = [];
    for (let col = 0; col < cols; col++) {
      cells[row][col] = {
        letter: '',
        position: { row, col },
      };
    }
  }
  return { cells, rows, cols };
}

/**
 * Creates a grid from a 2D array of letters
 */
export function createGridFromLetters(letters: string[][]): Grid {
  const rows = letters.length;
  const cols = letters[0]?.length ?? 0;
  const cells: Cell[][] = letters.map((row, rowIndex) =>
    row.map((letter, colIndex) => ({
      letter: letter.toUpperCase(),
      position: { row: rowIndex, col: colIndex },
    }))
  );
  return { cells, rows, cols };
}

/**
 * Gets the letter at a specific position
 */
export function getLetterAt(grid: Grid, position: Position): string | null {
  if (!isValidPosition(grid, position)) {
    return null;
  }
  return grid.cells[position.row][position.col].letter;
}

/**
 * Checks if a position is valid within the grid bounds
 */
export function isValidPosition(grid: Grid, position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < grid.rows &&
    position.col >= 0 &&
    position.col < grid.cols
  );
}

/**
 * Gets the word formed by a path through the grid
 */
export function getWordFromPath(grid: Grid, path: Position[]): string {
  return path
    .map((pos) => getLetterAt(grid, pos) ?? '')
    .join('');
}
```

**File**: `src/game/__tests__/grid.test.ts`

```typescript
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
  });
});
```

---

## 1.3 Neighbors Module

**File**: `src/game/neighbors.ts`

```typescript
import { Grid, Position } from './types';
import { isValidPosition } from './grid';

const DIRECTIONS: Position[] = [
  { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
  { row: 0, col: -1 },                        { row: 0, col: 1 },
  { row: 1, col: -1 },  { row: 1, col: 0 },  { row: 1, col: 1 },
];

export function getNeighbors(grid: Grid, position: Position): Position[] {
  return DIRECTIONS
    .map((dir) => ({
      row: position.row + dir.row,
      col: position.col + dir.col,
    }))
    .filter((pos) => isValidPosition(grid, pos));
}

export function areNeighbors(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  if (rowDiff === 0 && colDiff === 0) return false;
  return rowDiff <= 1 && colDiff <= 1;
}

export function isPositionInPath(path: Position[], position: Position): boolean {
  return path.some((p) => p.row === position.row && p.col === position.col);
}
```

**File**: `src/game/__tests__/neighbors.test.ts`

```typescript
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
```
