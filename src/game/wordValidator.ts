import { words } from '../words';

let wordSet: Set<string> | null = null;

function getWordSet(): Set<string> {
  if (!wordSet) {
    wordSet = new Set(words.map((w) => w.toUpperCase()));
  }
  return wordSet;
}

export function isValidWord(word: string): boolean {
  return getWordSet().has(word.toUpperCase());
}

export function meetsLengthRequirement(
  word: string,
  minLength: number,
  maxLength: number = Infinity
): boolean {
  return word.length >= minLength && word.length <= maxLength;
}

export function isValidPrefix(prefix: string): boolean {
  if (!prefix) return true;
  const target = prefix.toLowerCase();
  let low = 0;
  let high = words.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const word = words[mid];

    if (word.startsWith(target)) {
      return true;
    }

    if (word < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return false;
}
