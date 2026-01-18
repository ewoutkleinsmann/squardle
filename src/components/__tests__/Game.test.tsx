import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Game } from '../Game';
import * as useGameStateHook from '../../hooks/useGameState';
import { createEmptyGrid } from '../../game/grid';

// Mock useGameState
vi.mock('../../hooks/useGameState');

describe('Game', () => {
  const mockState = {
    grid: createEmptyGrid(4, 4),
    foundWords: [],
    allValidWords: ['WORD'],
    currentPath: [],
    isSelecting: false,
    score: 0,
  };

  const mockHook = {
    state: mockState,
    currentWord: '',
    isValid: false,
    startSelection: vi.fn(),
    extendSelection: vi.fn(),
    endSelection: vi.fn(),
    newGame: vi.fn(),
    resetGame: vi.fn(),
  };

  it('renders game components', () => {
    vi.mocked(useGameStateHook.useGameState).mockReturnValue(mockHook);
    render(<Game />);

    expect(screen.getByTestId('game')).toBeInTheDocument();
    expect(screen.getByTestId('word-counter')).toBeInTheDocument();
    expect(screen.getByTestId('score-display')).toBeInTheDocument();
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId('current-word')).toBeInTheDocument();
    expect(screen.getByTestId('game-controls')).toBeInTheDocument();
    expect(screen.getByTestId('board')).toBeInTheDocument();
    expect(screen.getByTestId('word-list')).toBeInTheDocument();
  });

  it('passes found words to board', () => {
    const foundWordState = {
        ...mockState,
        foundWords: [{ word: 'TEST', path: [{row: 0, col: 0}], points: 1 }]
    };
    vi.mocked(useGameStateHook.useGameState).mockReturnValue({
        ...mockHook,
        state: foundWordState
    });

    render(<Game />);
    expect(screen.getByTestId('board')).toBeInTheDocument();
  });
});
