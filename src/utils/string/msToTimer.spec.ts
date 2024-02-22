import {
  MSINADAY,
  MSINAMINUTE,
  MSINANHOUR,
  MSINASECOND,
} from "../../constants";
import { msToTimer } from "./msToTimer";

describe("msToTimer", () => {
  it("turns ms to a human readable format", () => {
    const TEN = 10;
    const TWELVE = 12;
    const FORTYFIVE = 45;
    expect(msToTimer(MSINASECOND)).toBe("00:00:01");
    expect(msToTimer(MSINASECOND * FORTYFIVE)).toBe("00:00:45");
    expect(msToTimer(MSINAMINUTE)).toBe("00:01:00");
    expect(msToTimer(MSINAMINUTE + MSINASECOND)).toBe("00:01:01");
    expect(msToTimer(MSINANHOUR - MSINAMINUTE)).toBe("00:59:00");
    expect(msToTimer(MSINANHOUR + MSINAMINUTE)).toBe("01:01:00");
    expect(msToTimer(MSINANHOUR + MSINASECOND * TWELVE)).toBe("01:00:12");
    expect(msToTimer(MSINANHOUR * TEN)).toBe("10:00:00");
    expect(msToTimer(MSINADAY / 2)).toBe("12:00:00");
    expect(msToTimer(MSINADAY / 2 + MSINASECOND * FORTYFIVE)).toBe("12:00:45");
  });
});
