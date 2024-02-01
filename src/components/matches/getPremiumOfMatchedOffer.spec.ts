import { CENT, SATSINBTC } from "../../constants";
import { getPremiumOfMatchedOffer } from "./getPremiumOfMatchedOffer";

describe("getPremiumOfMatchedOffer", () => {
  it("should return the premium of an offer", () => {
    const expectedPremium = 10;
    const amount = 100000;
    const priceBook = {
      EUR: 100000,
    };
    const marketPrice = (amount / SATSINBTC) * priceBook.EUR;
    const price = marketPrice + (marketPrice * expectedPremium) / CENT;

    const premium = getPremiumOfMatchedOffer(
      { amount, price, currency: "EUR" },
      priceBook,
    );

    expect(premium).toEqual(expectedPremium);
  });
});
