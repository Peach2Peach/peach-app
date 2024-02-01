import { isPhoneAllowed } from "./isPhoneAllowed";

jest.mock("../country/countryMap", () => ({
  countryMap: {
    CH: {
      dialCode: "+41",
      highRisk: false,
    },
    CM: {
      dialCode: "+237",
      highRisk: true,
    },
    US: {
      dialCode: "+1",
      highRisk: false,
    },
    CA: {
      dialCode: "+1",
      phoneAreaCodes: ["204"],
      highRisk: false,
    },
  },
}));

describe("isPhoneAllowed", () => {
  it("returns false if a phone is from a high risk country", () => {
    expect(isPhoneAllowed("+2371234566")).toEqual(false);
  });
  it("returns false if a phone is from the US", () => {
    expect(isPhoneAllowed("+11230984")).toEqual(false);
  });
  it("returns true if a phone is from Canada", () => {
    expect(isPhoneAllowed("+1204123456")).toEqual(true);
  });
  it("returns true if a phone is not from a high risk country", () => {
    expect(isPhoneAllowed("+411230984")).toEqual(true);
  });
  it("returns false if a phone does not belong to any country", () => {
    expect(isPhoneAllowed("+9903298")).toEqual(false);
  });
});
