import { enforceEmailFormat } from "./enforceEmailFormat";

describe("enforceEmailFormat", () => {
  it("should format an email correctly", () => {
    expect(enforceEmailFormat("SaTOSHI@gmx.com")).toEqual("satoshi@gmx.com");
    expect(enforceEmailFormat("satoshi@gmx.com")).toEqual("satoshi@gmx.com");
  });
});
