import { MSINAMONTH, MSINASECOND } from "../../../constants";
import { shouldShowBackupReminder } from "./shouldShowBackupReminder";

const MOCK_DATE = 21000000000000;
jest.spyOn(Date, "now").mockImplementation(() => MOCK_DATE);
describe("shouldShowBackupReminder", () => {
  it("should return false if no backup has ever been made", () => {
    expect(shouldShowBackupReminder(undefined, undefined)).toBe(false);
  });
  it("should return false if a backup has been made less than a month ago", () => {
    expect(shouldShowBackupReminder(Date.now() - MSINASECOND, undefined)).toBe(
      false,
    );
    expect(shouldShowBackupReminder(undefined, Date.now() - MSINASECOND)).toBe(
      false,
    );
  });
  it("should return true if no backup has been made in the last month", () => {
    expect(shouldShowBackupReminder(Date.now() - MSINAMONTH, undefined)).toBe(
      true,
    );
    expect(shouldShowBackupReminder(undefined, Date.now() - MSINAMONTH)).toBe(
      true,
    );
  });
});
