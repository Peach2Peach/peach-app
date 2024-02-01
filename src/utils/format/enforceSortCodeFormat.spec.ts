import { enforceSortCodeFormat } from "./enforceSortCodeFormat";

describe("enforceSortCodeFormat", () => {
  it("should return empty string when input is empty string", () => {
    const result = enforceSortCodeFormat("");
    expect(result).toBe("");
  });

  it("should remove spaces", () => {
    const result = enforceSortCodeFormat("12 34 56 78");
    expect(result).toBe("12345678");
  });

  it("should remove non numerical characters", () => {
    const result = enforceSortCodeFormat("ab cd ef|@#¢∞¬÷“");
    expect(result).toBe("");
  });
});
