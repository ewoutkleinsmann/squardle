import './ProgressBar.css';

export function ProgressBar({ found, total }: { found: number; total: number }) {
  const pct = total > 0 ? (found / total) * 100 : 0;
  return (
    <div className="progress-bar" data-testid="progress-bar">
      <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
