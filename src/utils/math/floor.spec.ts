/* eslint-disable no-magic-numbers */
import { strictEqual } from "assert";
import { floor } from "./floor";

describe("floor", () => {
  it("floors values to integers", () => {
    strictEqual(floor(1.348), 1);
    strictEqual(floor(1.5), 1);
    strictEqual(floor(1.501), 1);
    strictEqual(floor(10.348), 10);
    strictEqual(floor(10.501), 10);
  });

  it("floors values to one digit after the comma", () => {
    strictEqual(floor(1.348, 1), 1.3);
    strictEqual(floor(1.5, 1), 1.5);
    strictEqual(floor(1.501, 1), 1.5);
    strictEqual(floor(10.348, 1), 10.3);
    strictEqual(floor(10.501, 1), 10.5);
  });

  it("floors values to two digits after the comma", () => {
    strictEqual(floor(1.348, 2), 1.34);
    strictEqual(floor(1.5, 2), 1.5);
    strictEqual(floor(1.501, 2), 1.5);
    strictEqual(floor(10.348, 2), 10.34);
    strictEqual(floor(10.501, 2), 10.5);
  });

  it("floors values to three and above digits after the comma", () => {
    strictEqual(floor(1.348, 3), 1.348);
    strictEqual(floor(1.5, 3), 1.5);
    strictEqual(floor(1.501, 3), 1.501);
    strictEqual(floor(10.348, 3), 10.348);
    strictEqual(floor(10.501, 3), 10.501);

    strictEqual(floor(1.348, 4), 1.348);
    strictEqual(floor(1.5, 4), 1.5);
    strictEqual(floor(1.501, 4), 1.5009);
    strictEqual(floor(10.348, 4), 10.348);
    strictEqual(floor(10.501, 4), 10.501);

    strictEqual(floor(10.501298740982, 9), 10.50129874);
  });

  it("floors values to desired power of 10", () => {
    strictEqual(floor(1.348, -1), 0);
    strictEqual(floor(5, -1), 0);
    strictEqual(floor(10.348, -1), 10);
    strictEqual(floor(15.348, -1), 10);
    strictEqual(floor(153, -1), 150);

    strictEqual(floor(1.348, -2), 0);
    strictEqual(floor(5, -2), 0);
    strictEqual(floor(10.348, -2), 0);
    strictEqual(floor(15.348, -2), 0);
    strictEqual(floor(143, -2), 100);
    strictEqual(floor(153, -2), 100);
    strictEqual(floor(3924309.873318372, -4), 3920000);
    strictEqual(floor(3924309.873318372, 4), 3924309.8733);

    strictEqual(floor(9999, -4), 0);
    strictEqual(floor(15321, -4), 10000);
  });
});
