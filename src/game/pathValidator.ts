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
