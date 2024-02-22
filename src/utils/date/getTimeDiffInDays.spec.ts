import { MSINANHOUR } from "../../constants";
import { getTimeDiffInDays } from "./getTimeDiffInDays";

const now = new Date("03 Jan 2009 00:00:00").getTime();
jest.spyOn(global.Date, "now").mockImplementation(() => now);
const date1 = new Date("01 Jan 2009");
const date2 = new Date("02 Jan 2009");
const date3 = new Date("03 Jan 2009");

describe("getTimeDiffInDays", () => {
  it("should return the correct difference in days", () => {
    expect(getTimeDiffInDays(date1)).toBe(2);
    expect(getTimeDiffInDays(date2)).toBe(1);
    expect(getTimeDiffInDays(date3)).toBe(0);
  });
  it("should return the correct difference in days even when it's less than 24 hours", () => {
    const date4 = new Date(now - MSINANHOUR);
    expect(getTimeDiffInDays(date4)).toBe(1);
  });
});
