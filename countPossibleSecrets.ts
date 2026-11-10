import { evaluateGuess } from "./evaluateGuess";

const BASE_DIGITS: Record<string, string> = {
  bin: "01",
  oct: "01234567",
  dec: "0123456789",
  hex: "0123456789abcdef",
};

// --- Memoization cache ---
// Key: `${length}:${base}`. Value: the precomputed list of all valid secrets.
// Because this list depends only on (length, base), a module-level cache
// avoids regenerating it on every call to countPossibleSecrets.
const allSecretsCache = new Map<string, string[]>();

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
    used.delete(digit);
  }

  return results;
};

const getAllSecrets = (length: number, base: string): string[] => {
  const key = `${length}:${base}`;
  const cached = allSecretsCache.get(key);
  if (cached) return cached;

  const generated = generateAllSecrets(length, base);
  allSecretsCache.set(key, generated);
  return generated;
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
  const allSecrets = getAllSecrets(length, base);

  const consistent = allSecrets.filter((secret) =>
    moves.every((move) => {
      const result = evaluateGuess(secret, move.guess);
      return result.bulls === move.bulls && result.cows === move.cows;
    }),
  );

  return consistent.length;
};
