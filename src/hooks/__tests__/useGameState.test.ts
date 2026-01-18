import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from '../useGameState';
import * as gridGenerator from '../../game/gridGenerator';
import { createGridFromLetters } from '../../game/grid';

vi.mock('../../game/gridGenerator', async () => {
  const actual = await vi.importActual('../../game/gridGenerator');
  return {
    ...actual,
    generateGrid: vi.fn(),
  };
});

describe('useGameState', () => {
  const mockGrid = createGridFromLetters([
    ['C', 'A', 'T', 'S'],
    ['O', 'R', 'E', 'X'],
    ['W', 'O', 'R', 'D'],
    ['S', 'E', 'A', 'T'],
  ]);
  const mockValidWords = ['CAT', 'WORD', 'SEAT'];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(gridGenerator.generateGrid).mockReturnValue({
      grid: mockGrid,
      validWords: mockValidWords,
    });
  });

  it('initializes game state', () => {
    const { result } = renderHook(() => useGameState());
    expect(result.current.state.grid).toEqual(mockGrid);
    expect(result.current.state.score).toBe(0);
    expect(result.current.state.foundWords).toEqual([]);
    expect(result.current.state.allValidWords).toEqual(mockValidWords);
  });

  it('handles selection', () => {
    const { result } = renderHook(() => useGameState());

    // Start
    act(() => {
      result.current.startSelection({ row: 0, col: 0 }); // C
    });
    expect(result.current.state.isSelecting).toBe(true);
    expect(result.current.state.currentPath).toHaveLength(1);
    expect(result.current.currentWord).toBe('C');

    // Extend
    act(() => {
      result.current.extendSelection({ row: 0, col: 1 }); // A
    });
    expect(result.current.currentWord).toBe('CA');

    // End
    act(() => {
      result.current.endSelection();
    });
    expect(result.current.state.isSelecting).toBe(false);
    expect(result.current.state.currentPath).toHaveLength(0);
  });

  it('ignores selection extension when not selecting', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
        result.current.extendSelection({ row: 0, col: 0 });
    });

    expect(result.current.state.isSelecting).toBe(false);
    expect(result.current.state.currentPath).toHaveLength(0);
  });

  it('ignores invalid selection extension', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
        result.current.startSelection({ row: 0, col: 0 });
    });

    act(() => {
        // Try to extend to non-neighbor (0, 2)
        result.current.extendSelection({ row: 0, col: 2 });
    });

    expect(result.current.state.currentPath).toHaveLength(1); // Should stay at 1
  });

  it('scores valid words', () => {
    const { result } = renderHook(() => useGameState({ minWordLength: 3 })); // Allow 3 letter words

    act(() => {
      result.current.startSelection({ row: 0, col: 0 }); // C
      result.current.extendSelection({ row: 0, col: 1 }); // A
      result.current.extendSelection({ row: 0, col: 2 }); // T
      result.current.endSelection();
    });

    expect(result.current.state.score).toBeGreaterThan(0);
    expect(result.current.state.foundWords).toHaveLength(1);
    expect(result.current.state.foundWords[0].word).toBe('CAT');
  });

  it('ignores duplicate words', () => {
    const { result } = renderHook(() => useGameState({ minWordLength: 3 }));

    // Find CAT first time
    act(() => {
      result.current.startSelection({ row: 0, col: 0 }); // C
      result.current.extendSelection({ row: 0, col: 1 }); // A
      result.current.extendSelection({ row: 0, col: 2 }); // T
      result.current.endSelection();
    });
    const score = result.current.state.score;

    // Find CAT again
    act(() => {
        result.current.startSelection({ row: 0, col: 0 }); // C
        result.current.extendSelection({ row: 0, col: 1 }); // A
        result.current.extendSelection({ row: 0, col: 2 }); // T
        result.current.endSelection();
    });

    expect(result.current.state.score).toBe(score);
    expect(result.current.state.foundWords).toHaveLength(1);
  });

  it('resets game', () => {
    const { result } = renderHook(() => useGameState({ minWordLength: 3 }));

    // Score some points
    act(() => {
        result.current.startSelection({ row: 0, col: 0 }); // C
        result.current.extendSelection({ row: 0, col: 1 }); // A
        result.current.extendSelection({ row: 0, col: 2 }); // T
        result.current.endSelection();
    });

    act(() => {
        result.current.resetGame();
    });

    expect(result.current.state.score).toBe(0);
    expect(result.current.state.foundWords).toHaveLength(0);
    // Grid remains same
    expect(result.current.state.grid).toEqual(mockGrid);
  });

  it('starts new game', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
        result.current.newGame();
    });

    expect(gridGenerator.generateGrid).toHaveBeenCalledTimes(2); // Init + newGame
  });
});
