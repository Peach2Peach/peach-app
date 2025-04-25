import { getRequiredAction } from "./getRequiredAction";

describe("getRequiredAction", () => {
  it("returns none if contract is null or canceled", () => {
    expect(getRequiredAction(null)).toBe("none");

    const canceledContract: Partial<Contract> = {
      id: "12-34",
      canceled: true,
      paymentMade: null,
      paymentConfirmed: null,
    };
    expect(getRequiredAction(canceledContract as Contract)).toBe("none");
  });

  it("returns sendPayment if payment has not been made", () => {
    const contract: Partial<Contract> = {
      id: "12-34",
      canceled: false,
      paymentMade: null,
      paymentConfirmed: null,
    };
    expect(getRequiredAction(contract as Contract)).toBe("sendPayment");
  });

  it("returns confirmPayment if payment has been made but not confirmed", () => {
    const contract: Partial<Contract> = {
      id: "12-34",
      canceled: false,
      paymentMade: new Date(),
      paymentConfirmed: null,
    };
    expect(getRequiredAction(contract as Contract)).toBe("confirmPayment");
  });

  it("returns none if contract does not require any action", () => {
    const contract: Partial<Contract> = {
      id: "12-34",
      canceled: false,
      paymentMade: new Date(),
      paymentConfirmed: new Date(),
    };
    expect(getRequiredAction(contract as Contract)).toBe("none");
  });
});
