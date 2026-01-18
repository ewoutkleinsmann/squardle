import { useState, useCallback, useMemo } from 'react';
import { Position, FoundWord, GameState, GridConfig } from '../game/types';
import { generateGrid } from '../game/gridGenerator';
import { getWordFromPath } from '../game/grid';
import { isValidWord, meetsLengthRequirement } from '../game/wordValidator';
import { canAddToPath } from '../game/pathValidator';
import { calculateWordScore } from '../game/scoring';

const DEFAULT: GridConfig = { rows: 4, cols: 4, minWords: 20, minWordLength: 4, maxWordLength: 15 };

export function useGameState(config: Partial<GridConfig> = {}) {
  // Destructure with defaults to ensure stable dependencies
  const {
    rows = DEFAULT.rows,
    cols = DEFAULT.cols,
    minWords = DEFAULT.minWords,
    minWordLength = DEFAULT.minWordLength,
    maxWordLength = DEFAULT.maxWordLength
  } = config;

  const cfg = useMemo(() => ({
    rows, cols, minWords, minWordLength, maxWordLength
  }), [rows, cols, minWords, minWordLength, maxWordLength]);

  const [state, setState] = useState<GameState>(() => {
    const { grid, validWords } = generateGrid(cfg);
    return { grid, foundWords: [], allValidWords: validWords, currentPath: [], isSelecting: false, score: 0 };
  });

  const currentWord = useMemo(() => getWordFromPath(state.grid, state.currentPath), [state.grid, state.currentPath]);
  const isValid = useMemo(() => meetsLengthRequirement(currentWord, cfg.minWordLength) && isValidWord(currentWord), [currentWord, cfg.minWordLength]);

  const startSelection = useCallback((pos: Position) => {
    setState((s) => ({ ...s, currentPath: [pos], isSelecting: true }));
  }, []);

  const extendSelection = useCallback((pos: Position) => {
    setState((s) => {
      if (!s.isSelecting) return s;
      if (!canAddToPath(s.grid, s.currentPath, pos)) return s;
      return { ...s, currentPath: [...s.currentPath, pos] };
    });
  }, []);

  const endSelection = useCallback(() => {
    setState((s) => {
      const word = getWordFromPath(s.grid, s.currentPath);
      const valid = meetsLengthRequirement(word, cfg.minWordLength) && isValidWord(word);
      const alreadyFound = s.foundWords.some((f) => f.word === word);

      if (valid && !alreadyFound) {
        const points = calculateWordScore(word.length, cfg.minWordLength);
        const newWord: FoundWord = { word, path: s.currentPath, points };
        return {
          ...s, currentPath: [], isSelecting: false,
          foundWords: [...s.foundWords, newWord],
          score: s.score + points,
        };
      }
      return { ...s, currentPath: [], isSelecting: false };
    });
  }, [cfg.minWordLength]);

  const newGame = useCallback(() => {
    const { grid, validWords } = generateGrid(cfg);
    setState({ grid, foundWords: [], allValidWords: validWords, currentPath: [], isSelecting: false, score: 0 });
  }, [cfg]);

  const resetGame = useCallback(() => {
    setState((s) => ({ ...s, foundWords: [], currentPath: [], score: 0 }));
  }, []);

  return { state, currentWord, isValid, startSelection, extendSelection, endSelection, newGame, resetGame };
}
