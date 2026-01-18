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
