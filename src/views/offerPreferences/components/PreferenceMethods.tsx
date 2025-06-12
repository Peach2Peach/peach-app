import { useOfferPreferences } from "../../../store/offerPreferenes";
import { Methods } from "./Methods";

export function PreferenceMethods({
  type,
  expressFilter = false,
}: {
  type: "buy" | "sell";
  expressFilter?: boolean;
}) {
  const meansOfPayment = expressFilter
    ? type === "sell"
      ? useOfferPreferences((state) => state.meansOfPaymentOnExpressSellFilter)
      : useOfferPreferences((state) => state.meansOfPaymentOnExpressBuyFilter)
    : useOfferPreferences((state) => state.meansOfPayment);

  return (
    <Methods
      type={type}
      meansOfPayment={meansOfPayment}
      expressFilter={expressFilter}
    />
  );
}
