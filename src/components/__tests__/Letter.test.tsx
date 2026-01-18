import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Letter } from '../Letter';

describe('Letter', () => {
  const defaultProps = {
    letter: 'A',
    position: { row: 0, col: 0 },
    isSelected: false,
    isInCurrentWord: false,
    onMouseDown: vi.fn(),
    onMouseEnter: vi.fn(),
  };

  it('renders letter', () => {
    render(<Letter {...defaultProps} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('applies selected class', () => {
    render(<Letter {...defaultProps} isSelected={true} />);
    expect(screen.getByTestId('letter-0-0')).toHaveClass('letter--selected');
  });

  it('applies in-word class', () => {
    render(<Letter {...defaultProps} isInCurrentWord={true} />);
    expect(screen.getByTestId('letter-0-0')).toHaveClass('letter--in-word');
  });

  it('calls onMouseDown with position', () => {
    render(<Letter {...defaultProps} />);
    fireEvent.mouseDown(screen.getByTestId('letter-0-0'));
    expect(defaultProps.onMouseDown).toHaveBeenCalledWith({ row: 0, col: 0 });
  });

  it('calls onMouseEnter with position', () => {
    render(<Letter {...defaultProps} />);
    fireEvent.mouseEnter(screen.getByTestId('letter-0-0'));
    expect(defaultProps.onMouseEnter).toHaveBeenCalledWith({ row: 0, col: 0 });
  });

  it('has data attributes for touch handling', () => {
    render(<Letter {...defaultProps} />);
    const el = screen.getByTestId('letter-0-0');
    expect(el).toHaveAttribute('data-row', '0');
    expect(el).toHaveAttribute('data-col', '0');
  });
});
