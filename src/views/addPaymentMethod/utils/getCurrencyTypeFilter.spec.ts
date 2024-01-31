import { getCurrencyTypeFilter } from "./getCurrencyTypeFilter";

describe("getCurrencyTypeFilter", () => {
  it('should return true if type is "europe" and currency is for europe', () => {
    const filter = getCurrencyTypeFilter("europe");
    expect(filter("EUR")).toBe(true);
    expect(filter("CHF")).toBe(true);
    expect(filter("GBP")).toBe(true);
    expect(filter("NOK")).toBe(true);
    expect(filter("USDT")).toBe(false);
    expect(filter("ARS")).toBe(false);
  });
  it('should return true if type is "latinAmerica" and currency is for latinAmerica', () => {
    const filter = getCurrencyTypeFilter("latinAmerica");
    expect(filter("ARS")).toBe(true);
    expect(filter("COP")).toBe(true);
    expect(filter("MXN")).toBe(true);
    expect(filter("EUR")).toBe(false);
    expect(filter("USDT")).toBe(false);
  });
  it('should return true if type is "other" and currency is for other', () => {
    const filter = getCurrencyTypeFilter("other");
    expect(filter("USDT")).toBe(true);
    expect(filter("SAT")).toBe(true);
    expect(filter("EUR")).toBe(false);
    expect(filter("ARS")).toBe(false);
  });
});
