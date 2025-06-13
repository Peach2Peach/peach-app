import { useOfferPreferences } from "../../../store/offerPreferenes";
import { Methods } from "./Methods";

export function PreferenceMethods({
  type,
  expressFilter = false,
}: {
  type: "buy" | "sell";
  expressFilter?: boolean;
}) {
  const [
    meansOfPayment,
    meansOfPaymentOnExpressBuyFilter,
    meansOfPaymentOnExpressSellFilter,
  ] = useOfferPreferences((state) => [
    state.meansOfPayment,
    state.meansOfPaymentOnExpressBuyFilter,
    state.meansOfPaymentOnExpressSellFilter,
  ]);

  return (
    <Methods
      type={type}
      meansOfPayment={
        expressFilter
          ? type === "sell"
            ? meansOfPaymentOnExpressSellFilter
            : meansOfPaymentOnExpressBuyFilter
          : meansOfPayment
      }
      expressFilter={expressFilter}
    />
  );
}
