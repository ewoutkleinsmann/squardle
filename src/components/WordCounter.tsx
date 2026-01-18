import './WordCounter.css';

export function WordCounter({ found, total }: { found: number; total: number }) {
  return (
    <div className="word-counter" data-testid="word-counter">
      <span className="word-counter__found">{found}</span>
      <span> / {total} words</span>
    </div>
  );
}
