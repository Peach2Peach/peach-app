import { toggleCurrency } from "./toggleCurrency";

describe("toggleCurrency", () => {
  it("should add a currency to the list if it's not already there", () => {
    expect(toggleCurrency("EUR")(["USD", "GBP"])).toEqual([
      "USD",
      "GBP",
      "EUR",
    ]);
  });

  it("should remove a currency from the list if it's already there", () => {
    expect(toggleCurrency("EUR")(["USD", "GBP", "EUR"])).toEqual([
      "USD",
      "GBP",
    ]);
  });
});
