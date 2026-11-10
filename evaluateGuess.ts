export interface EvaluationResult {
  bulls: number;
  cows: number;
}

export const evaluateGuess = (
  secret: string,
  guess: string,
): EvaluationResult => {
  const secretChars = secret.split("");
  const guessChars = guess.split("");

  // Bulls: same digit at the same position.
  // reduce walks over the secret and accumulates a count.
  const bulls = secretChars.reduce((count, secretChar, index) => {
    return secretChar === guessChars[index] ? count + 1 : count;
  }, 0);

  // Cows: digit exists in the secret, but at a different position.
  // Important: we must mark secret digits as consumed so a repeated guess digit
  // does not match the same secret digit twice.
  const remainingSecret = secretChars.filter((_, index) => {
    return secretChars[index] !== guessChars[index];
  });

  const cows = guessChars.reduce((count, guessChar, index) => {
    // Skip bulls — they are already counted.
    if (secretChars[index] === guessChar) return count;

    const matchIndex = remainingSecret.indexOf(guessChar);
    if (matchIndex === -1) return count;

    // Consume the matched digit so it cannot be counted again.
    remainingSecret.splice(matchIndex, 1);
    return count + 1;
  }, 0);

  return { bulls, cows };
};
