/* eslint-disable no-magic-numbers */
import { SATSINBTC } from "../../constants";
import { ceil } from "./ceil";

describe("ceil", () => {
  it("ceils values to integers", () => {
    expect(ceil(1.348)).toBe(2);
    expect(ceil(1.5)).toBe(2);
    expect(ceil(1.501)).toBe(2);
    expect(ceil(10.348)).toBe(11);
    expect(ceil(10.501)).toBe(11);
  });

  it("ceils values to one digit after the comma", () => {
    expect(ceil(1.348, 1)).toBe(1.4);
    expect(ceil(1.5, 1)).toBe(1.5);
    expect(ceil(1.501, 1)).toBe(1.6);
    expect(ceil(10.348, 1)).toBe(10.4);
    expect(ceil(10.501, 1)).toBe(10.6);
  });

  it("ceils values to two digits after the comma", () => {
    expect(ceil(1.348, 2)).toBe(1.35);
    expect(ceil(1.5, 2)).toBe(1.5);
    expect(ceil(1.501, 2)).toBe(1.51);
    expect(ceil(10.348, 2)).toBe(10.35);
    expect(ceil(10.501, 2)).toBe(10.51);
  });

  it("ceils values to three and above digits after the comma", () => {
    expect(ceil(1.348, 3)).toBe(1.348);
    expect(ceil(1.5, 3)).toBe(1.5);
    expect(ceil(1.501, 3)).toBe(1.501);
    expect(ceil(10.348, 3)).toBe(10.348);
    expect(ceil(10.501, 3)).toBe(10.501);

    expect(ceil(1.348, 4)).toBe(1.348);
    expect(ceil(1.5, 4)).toBe(1.5);
    expect(ceil(1.501, 4)).toBe(1.501);
    expect(ceil(10.348, 4)).toBe(10.3481);
    expect(ceil(10.501, 4)).toBe(10.501);

    expect(ceil(10.501298740982, 9)).toBe(10.501298741);
    expect(ceil(0.000981077468329593 * SATSINBTC, -4)).toBe(100000);
  });

  it("ceils values to desired power of 10", () => {
    expect(ceil(1.348, -1)).toBe(10);
    expect(ceil(5, -1)).toBe(10);
    expect(ceil(10.348, -1)).toBe(20);
    expect(ceil(15.348, -1)).toBe(20);
    expect(ceil(153, -1)).toBe(160);

    expect(ceil(1.348, -2)).toBe(100);
    expect(ceil(5, -2)).toBe(100);
    expect(ceil(10.348, -2)).toBe(100);
    expect(ceil(15.348, -2)).toBe(100);
    expect(ceil(143, -2)).toBe(200);
    expect(ceil(153, -2)).toBe(200);

    expect(ceil(9999, -4)).toBe(10000);
    expect(ceil(15321, -4)).toBe(20000);
  });
});
