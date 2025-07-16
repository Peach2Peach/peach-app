import { PaymentMethodInfo } from "../../../../peach-api/src/@types/payment";

export const getMatchPrice = (
  match: Match,
  selectedCurrency: Currency,
  paymentMethodInfo?: PaymentMethodInfo,
) => {
  const displayPrice =
    match.matched && match.matchedPrice !== null
      ? match.matchedPrice
      : paymentMethodInfo?.rounded
        ? Math.round(match.prices[selectedCurrency] ?? 0)
        : match.prices[selectedCurrency];

  return displayPrice ?? 0;
};
