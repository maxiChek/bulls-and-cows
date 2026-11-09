import { createDigitValidator } from "./createDigitValidator";

export const isValidGuess = (
  guess: string,
  length: number,
  base: string,
): boolean => {
  if (guess.length !== length) return false;

  const validate = createDigitValidator(base);
  const chars = guess.toLowerCase().split("");

  if (!chars.every(validate)) return false;

  return new Set(chars).size === chars.length;
};
