import { invert } from "./invert";

describe("invert", () => {
  it("should invert keys and values", () => {
    expect(invert({ b: 1, c: 2 })).toEqual({ 1: "b", 2: "c" });
  });
});
