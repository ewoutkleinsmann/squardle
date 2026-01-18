# Phase 2: React Components - Code Examples

## 2.1 Letter Component

**File**: `src/components/Letter.tsx`

```tsx
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
      onMouseDown={() => onMouseDown(position)}
      onMouseEnter={() => onMouseEnter(position)}
    >
      {letter}
    </div>
  );
}
```

**File**: `src/components/Letter.css`

```css
.letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  font-size: 28px;
  font-weight: bold;
  background: #f0f0f0;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
}

.letter--selected { background: #fff; border-color: #333; }
.letter--in-word { color: #c41e3a; border-color: #c41e3a; }
```

---

## 2.2 SelectionOverlay Component

**File**: `src/components/SelectionOverlay.tsx`

```tsx
import { Path } from '../game/types';
import './SelectionOverlay.css';

interface Props { path: Path; cellSize: number; gap: number; gridCols: number; gridRows: number; }

export function SelectionOverlay({ path, cellSize, gap, gridCols, gridRows }: Props) {
  if (path.length < 2) return null;

  const step = cellSize + gap;
  const half = cellSize / 2;
  const points = path.map((p) => ({ x: p.col * step + half, y: p.row * step + half }));
  const d = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');

  return (
    <svg className="selection-overlay" width={gridCols * step} height={gridRows * step} data-testid="selection-overlay">
      <path d={d} stroke="#c41e3a" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
      {points.map((pt, i) => <circle key={i} cx={pt.x} cy={pt.y} r="8" fill="#c41e3a" opacity="0.9" />)}
    </svg>
  );
}
```

**File**: `src/components/SelectionOverlay.css`

```css
.selection-overlay { position: absolute; top: 0; left: 0; pointer-events: none; }
```

---

## 2.3 Board Component

**File**: `src/components/Board.tsx`

```tsx
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
```

**File**: `src/components/Board.css`

```css
.board { position: relative; display: inline-block; }
.board__grid { display: grid; gap: 8px; }
```

---

## 2.4 UI Components

**File**: `src/components/WordCounter.tsx`

```tsx
import './WordCounter.css';

export function WordCounter({ found, total }: { found: number; total: number }) {
  return (
    <div className="word-counter" data-testid="word-counter">
      <span className="word-counter__found">{found}</span>
      <span> / {total} words</span>
    </div>
  );
}
```

**File**: `src/components/ScoreDisplay.tsx`

```tsx
import './ScoreDisplay.css';

export function ScoreDisplay({ score }: { score: number }) {
  return <div className="score-display" data-testid="score-display">Score: {score}</div>;
}
```

**File**: `src/components/ProgressBar.tsx`

```tsx
import './ProgressBar.css';

export function ProgressBar({ found, total }: { found: number; total: number }) {
  const pct = total > 0 ? (found / total) * 100 : 0;
  return (
    <div className="progress-bar" data-testid="progress-bar">
      <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
```

**File**: `src/components/CurrentWord.tsx`

```tsx
import './CurrentWord.css';

export function CurrentWord({ word, isValid }: { word: string; isValid: boolean }) {
  if (!word) return <div className="current-word current-word--empty" data-testid="current-word" />;
  return <div className={`current-word ${isValid ? 'current-word--valid' : ''}`} data-testid="current-word">{word}</div>;
}
```

**File**: `src/components/GameControls.tsx`

```tsx
import './GameControls.css';

export function GameControls({ onNewGame, onReset }: { onNewGame: () => void; onReset: () => void }) {
  return (
    <div className="game-controls" data-testid="game-controls">
      <button onClick={onNewGame} data-testid="new-game-button">🔄 New</button>
      <button onClick={onReset} data-testid="reset-button">↩️ Reset</button>
    </div>
  );
}
```

---

## 2.5 useGameState Hook

**File**: `src/hooks/useGameState.ts`

```typescript
import { useState, useCallback, useMemo } from 'react';
import { Grid, Position, Path, FoundWord, GameState, GridConfig } from '../game/types';
import { generateGrid } from '../game/gridGenerator';
import { getWordFromPath } from '../game/grid';
import { isValidWord, meetsLengthRequirement } from '../game/wordValidator';
import { canAddToPath } from '../game/pathValidator';
import { calculateWordScore } from '../game/scoring';

const DEFAULT: GridConfig = { rows: 4, cols: 4, minWords: 20, minWordLength: 4, maxWordLength: 15 };

export function useGameState(config: Partial<GridConfig> = {}) {
  const cfg = { ...DEFAULT, ...config };

  const [state, setState] = useState<GameState>(() => {
    const { grid, validWords } = generateGrid(cfg);
    return { grid, foundWords: [], allValidWords: validWords, currentPath: [], isSelecting: false, score: 0 };
  });

  const currentWord = useMemo(() => getWordFromPath(state.grid, state.currentPath), [state.grid, state.currentPath]);
  const isValid = useMemo(() => meetsLengthRequirement(currentWord, cfg.minWordLength) && isValidWord(currentWord), [currentWord, cfg.minWordLength]);

  const startSelection = useCallback((pos: Position) => {
    setState((s) => ({ ...s, currentPath: [pos], isSelecting: true }));
  }, []);

  const extendSelection = useCallback((pos: Position) => {
    setState((s) => {
      if (!s.isSelecting) return s;
      if (!canAddToPath(s.grid, s.currentPath, pos)) return s;
      return { ...s, currentPath: [...s.currentPath, pos] };
    });
  }, []);

  const endSelection = useCallback(() => {
    setState((s) => {
      const word = getWordFromPath(s.grid, s.currentPath);
      const valid = meetsLengthRequirement(word, cfg.minWordLength) && isValidWord(word);
      const alreadyFound = s.foundWords.some((f) => f.word === word);

      if (valid && !alreadyFound) {
        const points = calculateWordScore(word.length, cfg.minWordLength);
        const newWord: FoundWord = { word, path: s.currentPath, points };
        return {
          ...s, currentPath: [], isSelecting: false,
          foundWords: [...s.foundWords, newWord],
          score: s.score + points,
        };
      }
      return { ...s, currentPath: [], isSelecting: false };
    });
  }, [cfg.minWordLength]);

  const newGame = useCallback(() => {
    const { grid, validWords } = generateGrid(cfg);
    setState({ grid, foundWords: [], allValidWords: validWords, currentPath: [], isSelecting: false, score: 0 });
  }, [cfg]);

  const resetGame = useCallback(() => {
    setState((s) => ({ ...s, foundWords: [], currentPath: [], score: 0 }));
  }, []);

  return { state, currentWord, isValid, startSelection, extendSelection, endSelection, newGame, resetGame };
}
```

---

## 2.6 Game Component

**File**: `src/components/Game.tsx`

```tsx
import { useGameState } from '../hooks/useGameState';
import { Board } from './Board';
import { WordCounter } from './WordCounter';
import { ScoreDisplay } from './ScoreDisplay';
import { ProgressBar } from './ProgressBar';
import { CurrentWord } from './CurrentWord';
import { GameControls } from './GameControls';
import './Game.css';

export function Game() {
  const { state, currentWord, isValid, startSelection, extendSelection, endSelection, newGame, resetGame } = useGameState();

  return (
    <div className="game" data-testid="game">
      <WordCounter found={state.foundWords.length} total={state.allValidWords.length} />
      <ScoreDisplay score={state.score} />
      <ProgressBar found={state.foundWords.length} total={state.allValidWords.length} />
      <CurrentWord word={currentWord} isValid={isValid} />
      <GameControls onNewGame={newGame} onReset={resetGame} />
      <Board
        grid={state.grid}
        currentPath={state.currentPath}
        foundWordPaths={state.foundWords.map((f) => f.path)}
        onMouseDown={startSelection}
        onMouseEnter={extendSelection}
        onMouseUp={endSelection}
      />
    </div>
  );
}
```

**File**: `src/components/Game.css`

```css
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

---

## Phase 3: Integration

**Update** `src/App.tsx`:

```tsx
import { Game } from './components/Game';
import './App.css';

function App() {
  return (
    <div className="app">
      <Game />
    </div>
  );
}

export default App;
```

**Update** `src/App.css`:

```css
.app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
```
