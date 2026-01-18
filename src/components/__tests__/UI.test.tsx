import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WordCounter } from '../WordCounter';
import { ScoreDisplay } from '../ScoreDisplay';
import { ProgressBar } from '../ProgressBar';
import { CurrentWord } from '../CurrentWord';
import { GameControls } from '../GameControls';

describe('UI Components', () => {
  describe('WordCounter', () => {
    it('renders counts', () => {
      render(<WordCounter found={5} total={20} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('/ 20 words')).toBeInTheDocument();
    });
  });

  describe('ScoreDisplay', () => {
    it('renders score', () => {
      render(<ScoreDisplay score={100} />);
      expect(screen.getByText('Score: 100')).toBeInTheDocument();
    });
  });

  describe('ProgressBar', () => {
    it('renders progress', () => {
      render(<ProgressBar found={10} total={20} />);
      const fill = screen.getByTestId('progress-bar').firstChild;
      expect(fill).toHaveStyle({ width: '50%' });
    });

    it('handles zero total', () => {
      render(<ProgressBar found={0} total={0} />);
      const fill = screen.getByTestId('progress-bar').firstChild;
      expect(fill).toHaveStyle({ width: '0%' });
    });
  });

  describe('CurrentWord', () => {
    it('renders word', () => {
      render(<CurrentWord word="TEST" isValid={false} />);
      expect(screen.getByText('TEST')).toBeInTheDocument();
      expect(screen.getByTestId('current-word')).not.toHaveClass('current-word--valid');
    });

    it('renders valid word', () => {
      render(<CurrentWord word="VALID" isValid={true} />);
      expect(screen.getByTestId('current-word')).toHaveClass('current-word--valid');
    });

    it('renders empty state', () => {
      render(<CurrentWord word="" isValid={false} />);
      expect(screen.getByTestId('current-word')).toHaveClass('current-word--empty');
    });
  });

  describe('GameControls', () => {
    it('renders buttons', () => {
      const onNewGame = vi.fn();
      const onReset = vi.fn();
      render(<GameControls onNewGame={onNewGame} onReset={onReset} />);

      fireEvent.click(screen.getByTestId('new-game-button'));
      expect(onNewGame).toHaveBeenCalled();

      fireEvent.click(screen.getByTestId('reset-button'));
      expect(onReset).toHaveBeenCalled();
    });
  });
});
