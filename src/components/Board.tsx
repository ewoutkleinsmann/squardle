import { Grid, Position, Path } from '../game/types';
import { isPositionInPath } from '../game/neighbors';
import { Letter } from './Letter';
import { SelectionOverlay } from './SelectionOverlay';
import './Board.css';
import { useRef } from 'react';

interface Props {
  grid: Grid;
  currentPath: Path;
  foundWordPaths: Path[];
  onMouseDown: (pos: Position) => void;
  onMouseEnter: (pos: Position) => void;
  onMouseUp: () => void;
}

export function Board({ grid, currentPath, foundWordPaths, onMouseDown, onMouseEnter, onMouseUp }: Props) {
  const foundSet = new Set(foundWordPaths.flatMap((p) => p.map((pos) => `${pos.row},${pos.col}`)));
  const boardRef = useRef<HTMLDivElement>(null);

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent scrolling
    // e.preventDefault(); // Moved to CSS touch-action: none

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element instanceof HTMLElement) {
      const row = element.getAttribute('data-row');
      const col = element.getAttribute('data-col');

      if (row !== null && col !== null) {
        const pos = { row: parseInt(row), col: parseInt(col) };
        if (currentPath.length === 0) {
            onMouseDown(pos);
        } else {
            onMouseEnter(pos);
        }
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
      // Logic handled in move or handled similarly to mouse down if needed directly
      // But calculating elementFromPoint is safer for consistency
      handleTouchMove(e);
  };

  return (
    <div
      className="board"
      ref={boardRef}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchEnd={onMouseUp}
      onTouchCancel={onMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      data-testid="board"
    >
      <div className="board__grid" style={{ gridTemplateColumns: `repeat(${grid.cols}, 60px)` }}>
        {grid.cells.flat().map((cell) => (
          <Letter
            key={`${cell.position.row}-${cell.position.col}`}
            letter={cell.letter}
            position={cell.position}
            isSelected={foundSet.has(`${cell.position.row},${cell.position.col}`)}
            isInCurrentWord={isPositionInPath(currentPath, cell.position)}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
          />
        ))}
      </div>
      <SelectionOverlay path={currentPath} cellSize={60} gap={8} gridCols={grid.cols} gridRows={grid.rows} />
    </div>
  );
}
