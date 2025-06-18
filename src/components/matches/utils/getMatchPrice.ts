import { getPaymentMethodInfo } from "../../../utils/paymentMethod/getPaymentMethodInfo";

export const getMatchPrice = (
  {
    matched,
    matchedPrice,
    prices,
  }: Pick<Match, "matched" | "matchedPrice" | "prices">,
  selectedPaymentMethod: PaymentMethod | undefined,
  selectedCurrency: Currency,
) => {
  if (matched && matchedPrice !== null) return matchedPrice;
  const price = prices[selectedCurrency] ?? 0;
  if (getPaymentMethodInfo(selectedPaymentMethod)?.rounded) {
    return Math.round(price);
  }
  return price;
};
