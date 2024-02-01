/* eslint-disable no-magic-numbers */
import { priceFormat } from "./priceFormat";

describe("priceFormat", () => {
  it("formats the amount correctly", () => {
    expect(priceFormat(1234567.89)).toEqual("1 234 567.89");
    expect(priceFormat(123456.789)).toEqual("123 456.79");
    expect(priceFormat(123.456)).toEqual("123.46");
    expect(priceFormat(123)).toEqual("123.00");
  });
  it("formats the rounded amount correctly", () => {
    expect(priceFormat(1234567.89, true)).toEqual("1 234 568");
    expect(priceFormat(123456.789, true)).toEqual("123 457");
    expect(priceFormat(123.456, true)).toEqual("123");
    expect(priceFormat(123, true)).toEqual("123");
  });
  it("should handle Infinity", () => {
    expect(priceFormat(Infinity)).toEqual("∞");
  });
});
