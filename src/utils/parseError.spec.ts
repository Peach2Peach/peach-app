import { parseError } from "./parseError";

describe("parseError", () => {
  it("should parse an error", () => {
    expect(parseError(new Error("test"))).toBe("test");
    expect(parseError("test")).toBe("TEST");
    expect(parseError(1)).toBe("UNKNOWN_ERROR");
  });
});
