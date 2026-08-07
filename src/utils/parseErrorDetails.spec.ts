import { parseErrorDetails } from "./parseErrorDetails";

describe("parseErrorDetails", () => {
  it("should return an empty string when there are no details", () => {
    expect(parseErrorDetails(undefined)).toBe("");
    expect(parseErrorDetails(null)).toBe("");
    expect(parseErrorDetails([])).toBe("");
  });

  it("should join string details", () => {
    expect(parseErrorDetails(["amount", "premium"])).toBe("amount, premium");
    expect(parseErrorDetails("amount is invalid")).toBe("amount is invalid");
  });

  it("should format validation details", () => {
    expect(
      parseErrorDetails([
        { path: "amount", msg: "must be a number" },
        { param: "premium", message: "out of range" },
        { msg: "unknown field" },
        { field: "returnAddress" },
      ]),
    ).toBe(
      "amount: must be a number, premium: out of range, unknown field, returnAddress",
    );
  });

  it("should fall back to JSON for unknown shapes", () => {
    expect(parseErrorDetails([{ some: "thing" }])).toBe('{"some":"thing"}');
  });

  it("should truncate very long details", () => {
    const maxLength = 240;
    const details = "a".repeat(maxLength * 2);
    expect(parseErrorDetails(details)).toHaveLength(maxLength + 1);
    expect(parseErrorDetails(details).endsWith("…")).toBe(true);
  });
});
