import { getTxSummaryTitle } from "./getTxSummaryTitle";

describe("getTxSummaryTitle", () => {
  it("returns the correct string for a trade", () => {
    expect(getTxSummaryTitle("TRADE")).toEqual("bought");
  });

  it("returns the correct string for a trade with funded escrow", () => {
    expect(getTxSummaryTitle("ESCROWFUNDED")).toEqual("escrow funded");
  });

  it("returns the correct string for a refund", () => {
    expect(getTxSummaryTitle("REFUND")).toEqual("refund");
  });

  it("returns the correct string for a withdrawal", () => {
    expect(getTxSummaryTitle("WITHDRAWAL")).toEqual("sent");
  });

  it("returns the correct string for a deposit", () => {
    expect(getTxSummaryTitle("DEPOSIT")).toEqual("received");
  });
});
