/* eslint-disable no-magic-numbers */
import { getTradingAmountLimits } from "./getTradingAmountLimits";

describe("getTradingAmountLimits", () => {
  it("calculates the trading amount limits based on the given price for selling", () => {
    const [min, max] = getTradingAmountLimits(29980, "sell");
    expect(min).toEqual(40000);
    expect(max).toEqual(2660000);
  });
  it("calculates the trading amount limits based on the given price for buying", () => {
    const [min, max] = getTradingAmountLimits(29980, "buy");
    expect(min).toEqual(20000);
    expect(max).toEqual(3330000);
  });
});
