import { countPossibleSecrets } from "./countPossibleSecrets";

describe("countPossibleSecrets", () => {
  test("returns 90 permutations for length 2, dec, no moves", () => {
    // 10 * 9 = 90 ordered pairs of unique digits.
    expect(countPossibleSecrets(2, "dec", [])).toBe(90);
  });

  test("returns 10 permutations for length 1, dec, no moves", () => {
    expect(countPossibleSecrets(1, "dec", [])).toBe(10);
  });

  test("returns 2 permutations for length 2, bin, no moves", () => {
    // Only "01" and "10".
    expect(countPossibleSecrets(2, "bin", [])).toBe(2);
  });

  test("narrows to 1 when bulls equal full length", () => {
    // If guess "12" gives 2 bulls, the secret must be "12".
    const moves = [{ guess: "12", bulls: 2, cows: 0 }];
    expect(countPossibleSecrets(2, "dec", moves)).toBe(1);
  });

  test("narrows to 16 when guess gives 1 bull and 0 cows", () => {
    // Secret XY, guess "12":
    //   - bull for "1" at pos 0, "2" not in secret: 8 options for Y
    //   - bull for "2" at pos 1, "1" not in secret: 8 options for X
    const moves = [{ guess: "12", bulls: 1, cows: 0 }];
    expect(countPossibleSecrets(2, "dec", moves)).toBe(16);
  });

  test("narrows to 0 when constraints are impossible", () => {
    // Length 2, dec: guess "12" cannot give 3 bulls.
    const moves = [{ guess: "12", bulls: 3, cows: 0 }];
    expect(countPossibleSecrets(2, "dec", moves)).toBe(0);
  });

  test("filters cumulatively across multiple moves", () => {
    // First move narrows to 16, second further narrows.
    const moves = [
      { guess: "12", bulls: 1, cows: 0 },
      { guess: "34", bulls: 0, cows: 0 },
    ];
    // Manually: 16 options from the first move, exclude those containing "3" or "4".
    // From the 16: "10","13","14","15","16","17","18","19","02","32","42","52","62","72","82","92"
    // Remove those containing "3" or "4": "13","14","32","42".
    // Left: "10","15","16","17","18","19","02","52","62","72","82","92" = 12.
    expect(countPossibleSecrets(2, "dec", moves)).toBe(12);
  });
});
