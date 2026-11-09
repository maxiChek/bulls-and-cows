const DIGITS: Record<string, string> = {
  bin: "01",
  oct: "01234567",
  dec: "0123456789",
  hex: "0123456789abcdef",
};

export const createDigitValidator = (base: string) => {
  const allowed = DIGITS[base] ?? "";
  return (char: string): boolean => allowed.includes(char.toLowerCase());
};
