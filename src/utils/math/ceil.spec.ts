/* eslint-disable no-magic-numbers */
import { strictEqual } from "assert";
import { SATSINBTC } from "../../constants";
import { ceil } from "./ceil";

describe("ceil", () => {
  it("ceils values to integers", () => {
    strictEqual(ceil(1.348), 2);
    strictEqual(ceil(1.5), 2);
    strictEqual(ceil(1.501), 2);
    strictEqual(ceil(10.348), 11);
    strictEqual(ceil(10.501), 11);
  });

  it("ceils values to one digit after the comma", () => {
    strictEqual(ceil(1.348, 1), 1.4);
    strictEqual(ceil(1.5, 1), 1.5);
    strictEqual(ceil(1.501, 1), 1.6);
    strictEqual(ceil(10.348, 1), 10.4);
    strictEqual(ceil(10.501, 1), 10.6);
  });

  it("ceils values to two digits after the comma", () => {
    strictEqual(ceil(1.348, 2), 1.35);
    strictEqual(ceil(1.5, 2), 1.5);
    strictEqual(ceil(1.501, 2), 1.51);
    strictEqual(ceil(10.348, 2), 10.35);
    strictEqual(ceil(10.501, 2), 10.51);
  });

  it("ceils values to three and above digits after the comma", () => {
    strictEqual(ceil(1.348, 3), 1.348);
    strictEqual(ceil(1.5, 3), 1.5);
    strictEqual(ceil(1.501, 3), 1.501);
    strictEqual(ceil(10.348, 3), 10.348);
    strictEqual(ceil(10.501, 3), 10.501);

    strictEqual(ceil(1.348, 4), 1.348);
    strictEqual(ceil(1.5, 4), 1.5);
    strictEqual(ceil(1.501, 4), 1.501);
    strictEqual(ceil(10.348, 4), 10.3481);
    strictEqual(ceil(10.501, 4), 10.501);

    strictEqual(ceil(10.501298740982, 9), 10.501298741);
    strictEqual(ceil(0.000981077468329593 * SATSINBTC, -4), 100000);
  });

  it("ceils values to desired power of 10", () => {
    strictEqual(ceil(1.348, -1), 10);
    strictEqual(ceil(5, -1), 10);
    strictEqual(ceil(10.348, -1), 20);
    strictEqual(ceil(15.348, -1), 20);
    strictEqual(ceil(153, -1), 160);

    strictEqual(ceil(1.348, -2), 100);
    strictEqual(ceil(5, -2), 100);
    strictEqual(ceil(10.348, -2), 100);
    strictEqual(ceil(15.348, -2), 100);
    strictEqual(ceil(143, -2), 200);
    strictEqual(ceil(153, -2), 200);

    strictEqual(ceil(9999, -4), 10000);
    strictEqual(ceil(15321, -4), 20000);
  });
});
