import { useOfferPreferences } from "../../../store/offerPreferenes";
import { Methods } from "./Methods";

export function PreferenceMethods({
  type,
  setCurrency,
  meansOfPayment,
}: {
  type: "buy" | "sell";
  setCurrency: (c: Currency) => void;
  meansOfPayment?: Partial<Record<Currency, PaymentMethod[]>>;
}) {
  const appsMeansOfPayment = useOfferPreferences(
    (state) => state.meansOfPayment,
  );

  return (
    <Methods
      type={type}
      meansOfPayment={meansOfPayment ? meansOfPayment : appsMeansOfPayment}
      setCurrency={setCurrency}
      showSetPaymentMethodsButton={meansOfPayment === undefined}
      noBackground={meansOfPayment !== undefined}
    />
  );
}
