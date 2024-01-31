import { sortAlphabetically } from "./sortAlphabetically";

describe("sortAlphabetically", () => {
  it("should return -1 if the second string is greater than the first string", () => {
    const inputA = "cat";
    const inputB = "dog";

    const expectedOutput = -1;

    const result = sortAlphabetically(inputA, inputB);

    expect(result).toEqual(expectedOutput);
  });

  it("should return 1 if the first string is greater than the second string", () => {
    const inputA = "zebra";
    const inputB = "apple";

    const expectedOutput = 1;

    const result = sortAlphabetically(inputA, inputB);

    expect(result).toEqual(expectedOutput);
  });

  it("should return 0 if the two strings are equal", () => {
    const inputA = "banana";
    const inputB = "banana";

    const expectedOutput = 0;

    const result = sortAlphabetically(inputA, inputB);

    expect(result).toEqual(expectedOutput);
  });
});
