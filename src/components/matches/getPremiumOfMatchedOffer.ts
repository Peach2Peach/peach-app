import { CENT, SATSINBTC } from "../../constants";
import { round } from "../../utils/math/round";

export const getPremiumOfMatchedOffer = (
  {
    amount,
    price,
    currency,
  }: { amount: number; price: number; currency: Currency },
  priceBook?: Pricebook,
) => {
  const bitcoinPriceWhenMatched = (price / amount) * SATSINBTC;
  const bitcoinPrice = priceBook?.[currency] ?? bitcoinPriceWhenMatched;
  const delta = bitcoinPriceWhenMatched - bitcoinPrice;

  const premium = round((delta / bitcoinPrice) * CENT, 2);
  return premium;
};
