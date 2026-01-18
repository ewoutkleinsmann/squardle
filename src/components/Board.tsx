import { Grid, Position, Path } from '../game/types';
import { isPositionInPath } from '../game/neighbors';
import { Letter } from './Letter';
import { SelectionOverlay } from './SelectionOverlay';
import './Board.css';

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

  return (
    <div className="board" onMouseUp={onMouseUp} onMouseLeave={onMouseUp} data-testid="board">
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
