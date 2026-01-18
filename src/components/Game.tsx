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
