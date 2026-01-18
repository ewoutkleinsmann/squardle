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
