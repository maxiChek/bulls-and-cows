import { evaluateGuess } from "./evaluateGuess";

const BASE_DIGITS: Record<string, string> = {
  bin: "01",
  oct: "01234567",
  dec: "0123456789",
  hex: "0123456789abcdef",
};

export interface Move {
  guess: string;
  bulls: number;
  cows: number;
}

// Memoization cache
const memoCache = new Map<string, number>();

export const countPossibleSecrets = (
  length: number,
  base: string,
  moves: Move[],
): number => {
  const key = JSON.stringify({ length, base, moves });
  const cached = memoCache.get(key);
  if (cached !== undefined) return cached;

  const pool = (BASE_DIGITS[base] ?? "").split("");

  // Optimization: if there are no moves, calculate using math (permutations P(n, k))
  // instead of iterating over millions of combinations.
  if (moves.length === 0) {
    let n = pool.length;
    let result = 1;
    for (let i = 0; i < length; i++) {
      result *= n--;
    }
    memoCache.set(key, result);
    return result;
  }

  let count = 0;

  // Recursive search that counts valid secrets on the fly without storing them
  const search = (prefix: string, used: Set<string>): void => {
    if (prefix.length === length) {
      const isConsistent = moves.every((move) => {
        const result = evaluateGuess(prefix, move.guess);
        return result.bulls === move.bulls && result.cows === move.cows;
      });
      if (isConsistent) count++;
      return;
    }

    for (const digit of pool) {
      if (!used.has(digit)) {
        used.add(digit);
        search(prefix + digit, used);
        used.delete(digit); // backtrack
      }
    }
  };

  search("", new Set());
  memoCache.set(key, count);
  return count;
};
