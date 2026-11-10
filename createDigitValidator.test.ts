import { createDigitValidator } from "./createDigitValidator";

describe("createDigitValidator", () => {
  test('dec validator accepts "5"', () => {
    const validate = createDigitValidator("dec");
    expect(validate("5")).toBe(true);
  });

  test('dec validator rejects "a"', () => {
    const validate = createDigitValidator("dec");
    expect(validate("a")).toBe(false);
  });

  test('hex validator accepts both "a" and "A"', () => {
    const validate = createDigitValidator("hex");
    expect(validate("a")).toBe(true);
    expect(validate("A")).toBe(true);
  });

  test('bin validator rejects "2"', () => {
    const validate = createDigitValidator("bin");
    expect(validate("2")).toBe(false);
  });
});
