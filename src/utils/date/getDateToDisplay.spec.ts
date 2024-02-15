import { getDateToDisplay } from "./getDateToDisplay";

jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("03 Jan 2009").getTime());
const date1 = new Date("01 Jan 2009");
const date2 = new Date("02 Jan 2009");
const date3 = new Date("03 Jan 2009");
const date4 = new Date("01 Jan 2008");

describe("getDateToDisplay", () => {
  it("should return the correct date to display", () => {
    expect(getDateToDisplay(date1)).toBe("01/01/2009 (2 days ago)");
    expect(getDateToDisplay(date2)).toBe("02/01/2009 (yesterday)");
    expect(getDateToDisplay(date3)).toBe("03/01/2009 (today)");
    expect(getDateToDisplay(date4)).toBe("01/01/2008 (1 year and 2 days ago)");
  });
});
