import { FoundWord } from '../game/types';
import './WordList.css';

interface WordListProps {
  allValidWords: string[];
  foundWords: FoundWord[];
}

export function WordList({ allValidWords, foundWords }: WordListProps) {
  const foundSet = new Set(foundWords.map(fw => fw.word));

  // Group words by length
  const wordsByLength = allValidWords.reduce((acc, word) => {
    const len = word.length;
    if (!acc[len]) acc[len] = [];
    acc[len].push(word);
    return acc;
  }, {} as Record<number, string[]>);

  // Sort lengths
  const lengths = Object.keys(wordsByLength).map(Number).sort((a, b) => a - b);

  const formatWord = (word: string) => {
    if (foundSet.has(word)) return word;
    if (word.length <= 2) return word; // Should not happen with min length 4, but safe fallback
    return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
  };

  return (
    <div className="word-list" data-testid="word-list">
      {lengths.map(len => (
        <div key={len} className="word-list__group">
          <h3 className="word-list__header">{len} letters</h3>
          <ul className="word-list__items">
            {wordsByLength[len].sort().map(word => (
              <li key={word} className={`word-list__item ${foundSet.has(word) ? 'word-list__item--found' : ''}`}>
                {formatWord(word)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
