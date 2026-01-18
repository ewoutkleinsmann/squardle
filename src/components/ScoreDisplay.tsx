import './ScoreDisplay.css';

export function ScoreDisplay({ score }: { score: number }) {
  return <div className="score-display" data-testid="score-display">Score: {score}</div>;
}
