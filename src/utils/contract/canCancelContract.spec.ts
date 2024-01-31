import { MSINASECOND } from "../../constants";
import { canCancelContract } from "./canCancelContract";

describe("canCancelContract", () => {
  it("returns false if contract is in dispute", () => {
    const contract: Partial<Contract> = {
      disputeActive: true,
      paymentMade: null,
      canceled: false,
      cancelationRequested: false,
    };
    expect(canCancelContract(contract as Contract)).toBe(false);
  });

  it("returns false if payment has been made", () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      paymentMade: new Date(),
      canceled: false,
      cancelationRequested: false,
    };
    expect(canCancelContract(contract as Contract)).toBe(false);
  });

  it("returns false if cancelation has been requested", () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      paymentMade: null,
      canceled: false,
      cancelationRequested: true,
    };
    expect(canCancelContract(contract as Contract)).toBe(false);
  });

  it("returns false if contract has been canceled", () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      paymentMade: null,
      canceled: true,
      cancelationRequested: false,
    };
    expect(canCancelContract(contract as Contract)).toBe(false);
  });

  it("returns false if the payment is too late and the view is the seller", () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      paymentMade: null,
      canceled: false,
      cancelationRequested: false,
      paymentExpectedBy: new Date(Date.now() - MSINASECOND),
    };
    expect(canCancelContract(contract as Contract, "seller")).toBe(false);
    expect(canCancelContract(contract as Contract, "buyer")).toBe(true);
  });

  it("returns true in all other cases", () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      paymentMade: null,
      canceled: false,
      cancelationRequested: false,
    };
    expect(canCancelContract(contract as Contract)).toBe(true);
  });
});
