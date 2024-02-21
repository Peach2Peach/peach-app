/* eslint-disable no-magic-numbers */
import { interpolate } from "./interpolate";

describe("interpolate", () => {
  it("interpolates a number to a new range", () => {
    expect(interpolate(-1, [-1, 1], [0, 5])).toBe(0);
    expect(interpolate(0, [-1, 1], [0, 5])).toBe(2.5);
    expect(interpolate(1, [-1, 1], [0, 5])).toBe(5);
    expect(interpolate(0, [0, 5], [-1, 1])).toBe(-1);
    expect(interpolate(2.5, [0, 5], [-1, 1])).toBe(0);
    expect(interpolate(5, [0, 5], [-1, 1])).toBe(1);
    expect(interpolate(50000, [0, 50000], [400, 0])).toBe(0);
    expect(interpolate(0, [0, 50000], [400, 0])).toBe(400);
    expect(interpolate(25000, [0, 50000], [400, 0])).toBe(200);
    expect(interpolate(25000, [25000, 50000], [400, 0])).toBe(400);
    expect(interpolate(30000, [25000, 50000], [400, 0])).toBe(320);
  });
});
