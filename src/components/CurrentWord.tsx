import './CurrentWord.css';

export function CurrentWord({ word, isValid }: { word: string; isValid: boolean }) {
  if (!word) return <div className="current-word current-word--empty" data-testid="current-word" />;
  return <div className={`current-word ${isValid ? 'current-word--valid' : ''}`} data-testid="current-word">{word}</div>;
}
