/* eslint-disable no-magic-numbers */
import { floor } from "./floor";

describe("floor", () => {
  it("floors values to integers", () => {
    expect(floor(1.348)).toBe(1);
    expect(floor(1.5)).toBe(1);
    expect(floor(1.501)).toBe(1);
    expect(floor(10.348)).toBe(10);
    expect(floor(10.501)).toBe(10);
  });

  it("floors values to one digit after the comma", () => {
    expect(floor(1.348, 1)).toBe(1.3);
    expect(floor(1.5, 1)).toBe(1.5);
    expect(floor(1.501, 1)).toBe(1.5);
    expect(floor(10.348, 1)).toBe(10.3);
    expect(floor(10.501, 1)).toBe(10.5);
  });

  it("floors values to two digits after the comma", () => {
    expect(floor(1.348, 2)).toBe(1.34);
    expect(floor(1.5, 2)).toBe(1.5);
    expect(floor(1.501, 2)).toBe(1.5);
    expect(floor(10.348, 2)).toBe(10.34);
    expect(floor(10.501, 2)).toBe(10.5);
  });

  it("floors values to three and above digits after the comma", () => {
    expect(floor(1.348, 3)).toBe(1.348);
    expect(floor(1.5, 3)).toBe(1.5);
    expect(floor(1.501, 3)).toBe(1.501);
    expect(floor(10.348, 3)).toBe(10.348);
    expect(floor(10.501, 3)).toBe(10.501);

    expect(floor(1.348, 4)).toBe(1.348);
    expect(floor(1.5, 4)).toBe(1.5);
    expect(floor(1.501, 4)).toBe(1.5009);
    expect(floor(10.348, 4)).toBe(10.348);
    expect(floor(10.501, 4)).toBe(10.501);

    expect(floor(10.501298740982, 9)).toBe(10.50129874);
  });

  it("floors values to desired power of 10", () => {
    expect(floor(1.348, -1)).toBe(0);
    expect(floor(5, -1)).toBe(0);
    expect(floor(10.348, -1)).toBe(10);
    expect(floor(15.348, -1)).toBe(10);
    expect(floor(153, -1)).toBe(150);

    expect(floor(1.348, -2)).toBe(0);
    expect(floor(5, -2)).toBe(0);
    expect(floor(10.348, -2)).toBe(0);
    expect(floor(15.348, -2)).toBe(0);
    expect(floor(143, -2)).toBe(100);
    expect(floor(153, -2)).toBe(100);
    expect(floor(3924309.873318372, -4)).toBe(3920000);
    expect(floor(3924309.873318372, 4)).toBe(3924309.8733);

    expect(floor(9999, -4)).toBe(0);
    expect(floor(15321, -4)).toBe(10000);
  });
});
