import { getFiatPrice } from "./getFiatPrice";

describe("getFiatPrice", () => {
  it("should return fiat price for given bitcoin amount and price", () => {
    const amount = 42069;
    const btcPrice = 69420;
    expect(getFiatPrice(amount, btcPrice)).toEqual("29.20");
  });
});
