import { isSingleSigEscrow } from "./isSingleSigEscrow";

describe("isSingleSigEscrow", () => {
  it("only treats escrow version 2 as single sig", () => {
    expect(isSingleSigEscrow({ escrowVersion: 2 })).toBe(true);
    expect(isSingleSigEscrow({ escrowVersion: 1 })).toBe(false);
    expect(isSingleSigEscrow({ escrowVersion: 0 })).toBe(false);
    expect(isSingleSigEscrow({})).toBe(false);
    expect(isSingleSigEscrow(undefined)).toBe(false);
  });
});
