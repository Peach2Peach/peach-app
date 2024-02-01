/* eslint-disable no-magic-numbers */
import { strictEqual } from "assert";
import { sum } from "./sum";

describe("sum", () => {
  it("sums two numbers", () => {
    strictEqual(sum(1, 2), 3);
    strictEqual(sum(2, 2), 4);
    strictEqual(sum(3, 2), 5);
  });

  it("respects commutativity", () => {
    strictEqual(sum(1, 2), sum(2, 1));
  });

  it("respects associativity", () => {
    strictEqual(sum(sum(1, 2), 3), sum(1, sum(2, 3)));
  });

  it("respects identity", () => {
    strictEqual(sum(0, 1), 1);
    strictEqual(sum(1, 0), 1);
  });

  it("respects inverse", () => {
    strictEqual(sum(1, -1), 0);
    strictEqual(sum(-1, 1), 0);
  });
});
