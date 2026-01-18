import { Grid, Path } from './types';
import { getLetterAt, getWordFromPath } from './grid';
import { getNeighbors, isPositionInPath } from './neighbors';
import { isValidWord, meetsLengthRequirement, isValidPrefix } from './wordValidator';

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
  if (!isValidPrefix(word)) return;

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
  // Redundant prefix check removed

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
