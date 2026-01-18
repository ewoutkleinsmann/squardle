import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Board } from '../Board';
import { createGridFromLetters } from '../../game/grid';

describe('Board', () => {
  const grid = createGridFromLetters([
    ['A', 'B'],
    ['C', 'D'],
  ]);

  const defaultProps = {
    grid,
    currentPath: [],
    foundWordPaths: [],
    onMouseDown: vi.fn(),
    onMouseEnter: vi.fn(),
    onMouseUp: vi.fn(),
  };

  it('renders all letters', () => {
    render(<Board {...defaultProps} />);
    expect(screen.getAllByTestId(/letter-/)).toHaveLength(4);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('handles mouse events', () => {
    render(<Board {...defaultProps} />);
    const letterA = screen.getByTestId('letter-0-0');

    fireEvent.mouseDown(letterA);
    expect(defaultProps.onMouseDown).toHaveBeenCalledWith({ row: 0, col: 0 });

    fireEvent.mouseEnter(letterA);
    expect(defaultProps.onMouseEnter).toHaveBeenCalledWith({ row: 0, col: 0 });
  });

  it('handles mouse up on board', () => {
    render(<Board {...defaultProps} />);
    fireEvent.mouseUp(screen.getByTestId('board'));
    expect(defaultProps.onMouseUp).toHaveBeenCalled();
  });

  it('handles mouse leave on board', () => {
    render(<Board {...defaultProps} />);
    fireEvent.mouseLeave(screen.getByTestId('board'));
    expect(defaultProps.onMouseUp).toHaveBeenCalled();
  });

  it('passes selected state to letters', () => {
    // Found word A-B
    const foundPaths = [[{ row: 0, col: 0 }, { row: 0, col: 1 }]];
    render(<Board {...defaultProps} foundWordPaths={foundPaths} />);

    const letterA = screen.getByTestId('letter-0-0');
    expect(letterA).toHaveClass('letter--selected'); // Assuming Letter implementation applies this class
  });
});
