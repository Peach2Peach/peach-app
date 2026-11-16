import { getCurrencies } from "./getCurrencies";

/**
 * The currency an offer's currency tabs open on: the user's display currency
 * if the offer supports it, otherwise the offer's first currency.
 */
export const getDefaultOfferCurrency = (
  meansOfPayment: MeansOfPayment,
  displayCurrency: Currency,
): Currency => {
  const currencies = getCurrencies(meansOfPayment);
  return currencies.includes(displayCurrency) ? displayCurrency : currencies[0];
};
