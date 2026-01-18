import { Position } from '../game/types';
import './Letter.css';

export interface LetterProps {
  letter: string;
  position: Position;
  isSelected: boolean;
  isInCurrentWord: boolean;
  onMouseDown: (position: Position) => void;
  onMouseEnter: (position: Position) => void;
}

export function Letter({
  letter, position, isSelected, isInCurrentWord, onMouseDown, onMouseEnter,
}: LetterProps) {
  const classes = ['letter', isSelected && 'letter--selected', isInCurrentWord && 'letter--in-word']
    .filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      data-testid={`letter-${position.row}-${position.col}`}
      data-row={position.row}
      data-col={position.col}
      onMouseDown={() => onMouseDown(position)}
      onMouseEnter={() => onMouseEnter(position)}
    >
      {letter}
    </div>
  );
}
