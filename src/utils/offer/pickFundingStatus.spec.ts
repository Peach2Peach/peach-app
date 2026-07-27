import { pickFundingStatus } from "./pickFundingStatus";

const status = (overrides: Partial<FundingStatus> = {}): FundingStatus => ({
  status: "NULL",
  txIds: [],
  vouts: [],
  amounts: [],
  expiry: 43200,
  ...overrides,
});

describe("pickFundingStatus", () => {
  it("returns the bitcoin funding when there is no liquid funding", () => {
    const funding = status({ status: "FUNDED", amounts: [25000] });
    expect(pickFundingStatus(funding)).toBe(funding);
  });

  it("returns the bitcoin funding when the liquid funding is NULL", () => {
    const funding = status({ status: "MEMPOOL", amounts: [25000] });
    const fundingLiquid = status({ status: "NULL" });
    expect(pickFundingStatus(funding, fundingLiquid)).toBe(funding);
  });

  it("returns the liquid funding when it is active", () => {
    const funding = status({ status: "NULL" });
    const fundingLiquid = status({ status: "FUNDED", amounts: [35000] });
    expect(pickFundingStatus(funding, fundingLiquid)).toBe(fundingLiquid);
  });

  it("surfaces the liquid funded amount, not the empty bitcoin one", () => {
    const funding = status({ status: "NULL", amounts: [] });
    const fundingLiquid = status({ status: "FUNDED", amounts: [35000] });
    expect(pickFundingStatus(funding, fundingLiquid).amounts).toEqual([35000]);
  });
});
