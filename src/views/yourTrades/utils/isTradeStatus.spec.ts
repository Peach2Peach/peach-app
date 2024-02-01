import { isTradeStatus } from "./isTradeStatus";

describe("isTradeStatus", () => {
  it("should return true if trade status is known", () => {
    expect(isTradeStatus("confirmCancelation")).toBeTruthy();
  });
  it("should return false if trade status is unknown", () => {
    expect(isTradeStatus("totallyNew")).toBeFalsy();
  });
});
