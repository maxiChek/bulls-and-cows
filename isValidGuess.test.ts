import { isValidGuess } from "./isValidGuess";

describe("isValidGuess", () => {
  test('accepts valid guess "123" for length 3, dec', () => {
    expect(isValidGuess("123", 3, "dec")).toBe(true);
  });

  test("rejects guess with wrong length", () => {
    expect(isValidGuess("12", 3, "dec")).toBe(false);
  });

  test("rejects guess with invalid digit for base", () => {
    expect(isValidGuess("12a", 3, "dec")).toBe(false);
  });

  test("rejects guess with duplicate digits", () => {
    expect(isValidGuess("112", 3, "dec")).toBe(false);
  });

  test("accepts mixed-case hex guess", () => {
    expect(isValidGuess("1aB", 3, "hex")).toBe(true);
  });
});
