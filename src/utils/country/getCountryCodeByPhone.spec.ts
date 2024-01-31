import { getCountryCodeByPhone } from "./getCountryCodeByPhone";

jest.mock("./countryMap", () => ({
  countryMap: {
    CH: {
      dialCode: "+41",
    },
    ES: {
      dialCode: "+34",
    },
    CM: {
      dialCode: "+237",
    },
    US: {
      dialCode: "+1",
    },
    CA: {
      dialCode: "+1",
      phoneAreaCodes: ["204"],
    },
  },
}));

describe("getCountryCodeByPhone", () => {
  it("returns the country code that the phone number belongs to", () => {
    expect(getCountryCodeByPhone("+411234566")).toEqual("CH");
    expect(getCountryCodeByPhone("+34029384")).toEqual("ES");
  });
  it("clears up ambiguities by checking area codes", () => {
    expect(getCountryCodeByPhone("+1304823490")).toEqual("US");
    expect(getCountryCodeByPhone("+1204123456")).toEqual("CA");
  });
  it("returns undefined if country could not be found", () => {
    expect(getCountryCodeByPhone("+99029384")).toEqual(undefined);
  });
});
