/* eslint-disable no-magic-numbers */
import { round } from "./round";

describe("round", () => {
  it("rounds values to integers", () => {
    expect(round(1.348)).toBe(1);
    expect(round(1.5)).toBe(2);
    expect(round(1.501)).toBe(2);
    expect(round(10.348)).toBe(10);
    expect(round(10.501)).toBe(11);
  });

  it("rounds values to one digit after the comma", () => {
    expect(round(1.348, 1)).toBe(1.3);
    expect(round(1.5, 1)).toBe(1.5);
    expect(round(1.501, 1)).toBe(1.5);
    expect(round(10.348, 1)).toBe(10.3);
    expect(round(10.501, 1)).toBe(10.5);
  });

  it("rounds values to two digits after the comma", () => {
    expect(round(1.348, 2)).toBe(1.35);
    expect(round(1.5, 2)).toBe(1.5);
    expect(round(1.501, 2)).toBe(1.5);
    expect(round(10.348, 2)).toBe(10.35);
    expect(round(10.501, 2)).toBe(10.5);
  });

  it("rounds values to three and above digits after the comma", () => {
    expect(round(1.348, 3)).toBe(1.348);
    expect(round(1.5, 3)).toBe(1.5);
    expect(round(1.501, 3)).toBe(1.501);
    expect(round(10.348, 3)).toBe(10.348);
    expect(round(10.501, 3)).toBe(10.501);

    expect(round(1.348, 4)).toBe(1.348);
    expect(round(1.5, 4)).toBe(1.5);
    expect(round(1.501, 4)).toBe(1.501);
    expect(round(10.348, 4)).toBe(10.348);
    expect(round(10.501, 4)).toBe(10.501);

    expect(round(10.501298740982, 9)).toBe(10.501298741);
  });

  it("rounds values to desired power of 10", () => {
    expect(round(1.348, -1)).toBe(0);
    expect(round(5, -1)).toBe(10);
    expect(round(10.348, -1)).toBe(10);
    expect(round(15.348, -1)).toBe(20);
    expect(round(153, -1)).toBe(150);

    expect(round(1.348, -2)).toBe(0);
    expect(round(5, -2)).toBe(0);
    expect(round(10.348, -2)).toBe(0);
    expect(round(15.348, -2)).toBe(0);
    expect(round(143, -2)).toBe(100);
    expect(round(153, -2)).toBe(200);
  });
});
