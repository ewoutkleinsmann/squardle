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
