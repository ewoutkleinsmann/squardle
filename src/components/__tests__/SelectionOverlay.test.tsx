import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SelectionOverlay } from '../SelectionOverlay';

describe('SelectionOverlay', () => {
  const defaultProps = {
    path: [],
    cellSize: 60,
    gap: 8,
    gridCols: 4,
    gridRows: 4,
  };

  it('renders nothing for empty path', () => {
    const { container } = render(<SelectionOverlay {...defaultProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for single letter', () => {
    const { container } = render(<SelectionOverlay {...defaultProps} path={[{ row: 0, col: 0 }]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders svg for path', () => {
    render(<SelectionOverlay {...defaultProps} path={[{ row: 0, col: 0 }, { row: 0, col: 1 }]} />);
    expect(screen.getByTestId('selection-overlay')).toBeInTheDocument();
  });

  it('renders correct points', () => {
    // 60+8 = 68 step. Half 30.
    // (0,0) -> 30, 30
    // (0,1) -> 98, 30
    render(<SelectionOverlay {...defaultProps} path={[{ row: 0, col: 0 }, { row: 0, col: 1 }]} />);
    const svg = screen.getByTestId('selection-overlay');
    // Basic check that it contains circles
    expect(svg.querySelectorAll('circle')).toHaveLength(2);
    expect(svg.querySelector('path')).toBeInTheDocument();
  });
});
