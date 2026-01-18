/** Position on the grid */
export interface Position {
  row: number;
  col: number;
}

/** A single cell in the grid */
export interface Cell {
  letter: string;
  position: Position;
}

/** The game grid */
export interface Grid {
  cells: Cell[][];
  rows: number;
  cols: number;
}

/** A path through the grid (sequence of positions) */
export type Path = Position[];

/** State of a found word */
export interface FoundWord {
  word: string;
  path: Path;
  points: number;
}

/** Complete game state */
export interface GameState {
  grid: Grid;
  foundWords: FoundWord[];
  allValidWords: string[];
  currentPath: Path;
  isSelecting: boolean;
  score: number;
}

/** Configuration for grid generation */
export interface GridConfig {
  rows: number;
  cols: number;
  minWords: number;
  minWordLength: number;
  maxWordLength: number;
}
