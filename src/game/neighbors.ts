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
