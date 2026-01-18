import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WordList } from '../WordList';

describe('WordList', () => {
  const allValidWords = ['CATS', 'DOGS', 'APPLE', 'BEACH'];
  const foundWords = [{ word: 'CATS', path: [], points: 5 }];

  it('renders words grouped by length', () => {
    render(<WordList allValidWords={allValidWords} foundWords={[]} />);
    expect(screen.getByText('4 letters')).toBeInTheDocument();
    expect(screen.getByText('5 letters')).toBeInTheDocument();
  });

  it('masks unfound words', () => {
    render(<WordList allValidWords={allValidWords} foundWords={[]} />);
    expect(screen.getByText('C**S')).toBeInTheDocument();
    expect(screen.getByText('D**S')).toBeInTheDocument();
    expect(screen.getByText('A***E')).toBeInTheDocument();
  });

  it('reveals found words', () => {
    render(<WordList allValidWords={allValidWords} foundWords={foundWords} />);
    expect(screen.getByText('CATS')).toBeInTheDocument();
    expect(screen.getByText('D**S')).toBeInTheDocument();
  });

  it('marks found words with correct class', () => {
    render(<WordList allValidWords={allValidWords} foundWords={foundWords} />);
    const foundItem = screen.getByText('CATS').closest('li');
    expect(foundItem).toHaveClass('word-list__item--found');

    const unfoundItem = screen.getByText('D**S').closest('li');
    expect(unfoundItem).not.toHaveClass('word-list__item--found');
  });
});
