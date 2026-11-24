import { isInstantTradeSellOffer } from "./isInstantTradeSellOffer";

describe("isInstantTradeSellOffer", () => {
  it("is instant trade when some payment data is encrypted", () => {
    expect(
      isInstantTradeSellOffer({
        paymentData: {
          sepa: { hashes: [] } as never,
          wise: { encrypted: "-----BEGIN PGP MESSAGE-----" } as never,
        },
      }),
    ).toBe(true);
  });
  it("is NOT instant trade without encrypted payment data", () => {
    expect(
      isInstantTradeSellOffer({ paymentData: { wise: { encrypted: "" } } }),
    ).toBe(false);
    expect(isInstantTradeSellOffer({ paymentData: {} })).toBe(false);
    expect(isInstantTradeSellOffer({})).toBe(false);
  });
});
