import { generateSecret } from "./generateSecret";

describe("generateSecret", () => {
  test("returns a secret of the requested length", () => {
    const random = () => 0;
    const secret = generateSecret(4, "dec", random);
    expect(secret).toHaveLength(4);
  });

  test("returns a secret with unique digits", () => {
    const random = () => 0.5;
    const secret = generateSecret(4, "dec", random);
    const uniqueDigits = new Set(secret.split(""));
    expect(uniqueDigits.size).toBe(4);
  });

  test("uses only digits allowed for the base", () => {
    const random = () => 0.5;
    const secret = generateSecret(2, "bin", random);
    // Regex: two characters, each either "0" or "1".
    expect(secret).toMatch(/^[01]{2}$/);
  });

  test("returns the same result for the same random values", () => {
    // Same deterministic random -> same secret. This proves the function has no hidden state.
    const random = () => 0.3;
    const first = generateSecret(3, "dec", random);
    const second = generateSecret(3, "dec", random);
    expect(first).toBe(second);
  });

  test("throws when length exceeds available digits for the base", () => {
    const random = () => 0.5;
    expect(() => generateSecret(3, "bin", random)).toThrow(
      "Secret length cannot exceed the number of available digits for the base.",
    );
  });
});
