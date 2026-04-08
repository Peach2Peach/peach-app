import {
  MeansOfPayment,
  PaymentMethodInfo,
} from "../../../peach-api/src/@types/payment";
import { keys } from "../object/keys";
import { isCashTrade } from "./isCashTrade";

/**
 * Removes payment-method/currency pairs from `meansOfPayment` whose currency
 * is no longer offered by the backend for that payment method.
 *
 * Throws if any payment method present in `paymentData` ends up with zero
 * supported currencies after filtering.
 */
export const filterUnavailableCurrencies = (
  meansOfPayment: MeansOfPayment,
  paymentData: OfferPaymentData,
  paymentMethods?: PaymentMethodInfo[],
): { meansOfPayment: MeansOfPayment; didFilter: boolean } => {
  if (!paymentMethods) return { meansOfPayment, didFilter: false };

  const filtered: MeansOfPayment = {};
  let didFilter = false;
  for (const currency of keys(meansOfPayment)) {
    const methods = meansOfPayment[currency];
    if (!methods) continue;
    const validMethods = methods.filter((method) => {
      if (isCashTrade(method)) return true;
      const info = paymentMethods.find(({ id }) => id === method);
      return info?.currencies.includes(currency) ?? false;
    });
    if (validMethods.length !== methods.length) didFilter = true;
    if (validMethods.length > 0) filtered[currency] = validMethods;
  }

  for (const method of keys(paymentData)) {
    if (isCashTrade(method)) continue;
    const stillHasCurrency = keys(filtered).some((currency) =>
      filtered[currency]?.includes(method),
    );
    if (!stillHasCurrency) {
      throw new Error("PLEASE_UPDATE_PAYMENT_METHOD");
    }
  }

  return { meansOfPayment: filtered, didFilter };
};
