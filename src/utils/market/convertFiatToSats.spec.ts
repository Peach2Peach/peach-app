import { SATSINBTC } from "../../constants";
import { convertFiatToSats } from "./convertFiatToSats";

describe("convertFiatToSats", () => {
  it("calculates price for given amount of sats", () => {
    const amount1 = 10;
    const bitcoinPrice = 25000;
    const expectedSatsAmount1 = 40000;
    expect(convertFiatToSats(amount1, bitcoinPrice)).toEqual(
      expectedSatsAmount1,
    );
    const amount2 = bitcoinPrice;
    expect(convertFiatToSats(amount2, bitcoinPrice)).toEqual(SATSINBTC);
  });
});
