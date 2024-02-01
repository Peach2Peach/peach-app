import { getShortDateFormat } from "./getShortDateFormat";

describe("getShortDateFormat", () => {
  it("should return the date in short format if the date is not today or yesterday", () => {
    const date = new Date("2020-01-01");
    expect(getShortDateFormat(date)).toEqual("01 / 01 / 20");
  });
});
