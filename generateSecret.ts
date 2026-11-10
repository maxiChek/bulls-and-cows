const DIGITS: Record<string, string> = {
  bin: "01",
  oct: "01234567",
  dec: "0123456789",
  hex: "0123456789abcdef",
};

export const generateSecret = (
  length: number,
  base: string,
  random: () => number,
): string => {
  const availableDigits = DIGITS[base] ?? "";
  // Importent: make copyof the string
  const pool = availableDigits.split("");
  const secret: string[] = [];

  if (length > pool.length) {
    throw new Error(
      "Secret length cannot exceed the number of available digits for the base.",
    );
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(random() * pool.length);
    const chosenDigit = pool.splice(randomIndex, 1)[0]!;
    secret.push(chosenDigit);
  }

  return secret.join("");
};
