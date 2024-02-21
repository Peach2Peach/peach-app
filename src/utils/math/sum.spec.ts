/* eslint-disable no-magic-numbers */
import { sum } from "./sum";

describe("sum", () => {
  it("sums two numbers", () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(2, 2)).toBe(4);
    expect(sum(3, 2)).toBe(5);
  });

  it("respects commutativity", () => {
    expect(sum(1, 2)).toBe(sum(2, 1));
  });

  it("respects associativity", () => {
    expect(sum(sum(1, 2), 3)).toBe(sum(1, sum(2, 3)));
  });

  it("respects identity", () => {
    expect(sum(0, 1)).toBe(1);
    expect(sum(1, 0)).toBe(1);
  });

  it("respects inverse", () => {
    expect(sum(1, -1)).toBe(0);
    expect(sum(-1, 1)).toBe(0);
  });
});
