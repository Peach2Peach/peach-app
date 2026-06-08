import { getUserCountry } from "../utils/system/getUserCountry";
import { checkBlockedCountry } from "./checkBlockedCountry";

jest.mock("../utils/system/getUserCountry");
const getUserCountryMock = jest.mocked(getUserCountry);

describe("checkBlockedCountry", () => {
  afterEach(() => {
    getUserCountryMock.mockReset();
  });

  it("returns the country code when the user is in a blocked country", async () => {
    getUserCountryMock.mockResolvedValueOnce("US");
    expect(await checkBlockedCountry()).toBe("US");

    getUserCountryMock.mockResolvedValueOnce("MA");
    expect(await checkBlockedCountry()).toBe("MA");
  });

  it("returns null when the user is in an allowed country", async () => {
    getUserCountryMock.mockResolvedValueOnce("FR");
    expect(await checkBlockedCountry()).toBeNull();
  });

  it("returns null when the country could not be determined", async () => {
    getUserCountryMock.mockResolvedValueOnce(null);
    expect(await checkBlockedCountry()).toBeNull();
  });
});
