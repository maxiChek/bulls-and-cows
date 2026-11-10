import { evaluateGuess } from "./evaluateGuess";

// Digits available for each base, as a plain record.
const BASE_DIGITS: Record<string, string> = {
  bin: "01",
  oct: "01234567",
  dec: "0123456789",
  hex: "0123456789abcdef",
};

// Generate all ordered sequences of unique digits of the given length.
// Uses recursion + backtracking: build the secret one digit at a time,
// and when the prefix reaches the target length, yield it.
const generateAllSecrets = (
  length: number,
  base: string,
  prefix = "",
  used = new Set<string>(),
): string[] => {
  if (prefix.length === length) {
    return [prefix];
  }

  const pool = (BASE_DIGITS[base] ?? "").split("");
  const results: string[] = [];

  for (const digit of pool) {
    if (used.has(digit)) continue;

    used.add(digit);
    results.push(...generateAllSecrets(length, base, prefix + digit, used));
    used.delete(digit); // backtrack: restore the state for the next branch
  }

  return results;
};

export interface Move {
  guess: string;
  bulls: number;
  cows: number;
}

export const countPossibleSecrets = (
  length: number,
  base: string,
  moves: Move[],
): number => {
  const allSecrets = generateAllSecrets(length, base);

  // Keep only secrets that produce the same evaluation as every recorded move.
  const consistent = allSecrets.filter((secret) =>
    moves.every((move) => {
      const result = evaluateGuess(secret, move.guess);
      return result.bulls === move.bulls && result.cows === move.cows;
    }),
  );

  return consistent.length;
};
