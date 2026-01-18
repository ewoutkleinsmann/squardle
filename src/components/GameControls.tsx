import './GameControls.css';

export function GameControls({ onNewGame, onReset }: { onNewGame: () => void; onReset: () => void }) {
  return (
    <div className="game-controls" data-testid="game-controls">
      <button onClick={onNewGame} data-testid="new-game-button">New Game</button>
      <button onClick={onReset} data-testid="reset-button">Reset</button>
    </div>
  );
}
