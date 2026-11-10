import { evaluateGuess } from "./evaluateGuess";

describe("evaluateGuess", () => {
  test("returns all bulls when guess equals secret", () => {
    expect(evaluateGuess("123", "123")).toEqual({ bulls: 3, cows: 0 });
  });

  test("returns all cows when digits match but positions differ", () => {
    expect(evaluateGuess("123", "312")).toEqual({ bulls: 0, cows: 3 });
  });

  test("returns mixed result for partially correct guess", () => {
    // secret "1234", guess "1325": "1" is a bull, "2" and "3" are cows, "5" is nothing
    expect(evaluateGuess("1234", "1325")).toEqual({ bulls: 1, cows: 2 });
  });

  test("returns zeros when no digit matches", () => {
    expect(evaluateGuess("1234", "5678")).toEqual({ bulls: 0, cows: 0 });
  });

  test("counts duplicate guess digits only once against the secret", () => {
    // secret "123", guess "111": only one "1" can be a bull.
    // The other "1"s have no match left in the secret, so cows stay 0.
    expect(evaluateGuess("123", "111")).toEqual({ bulls: 1, cows: 0 });
  });
});
