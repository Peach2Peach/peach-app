import { useOfferPreferences } from "../../../store/offerPreferenes";
import { Methods } from "./Methods";

export function PreferenceMethods({
  type,
  setCurrency,
  meansOfPayment,
  paymentData,
}: {
  type: "buy" | "sell";
  setCurrency: (c: Currency) => void;
  meansOfPayment?: Partial<Record<Currency, PaymentMethod[]>>;
  paymentData?: OfferPaymentData;
}) {
  const appsMeansOfPayment = useOfferPreferences(
    (state) => state.meansOfPayment,
  );
  const appsPaymentData = useOfferPreferences((state) => state.paymentData);

  return (
    <Methods
      type={type}
      meansOfPayment={meansOfPayment ? meansOfPayment : appsMeansOfPayment}
      paymentData={paymentData ? paymentData : appsPaymentData}
      setCurrency={setCurrency}
      showSetPaymentMethodsButton={meansOfPayment === undefined}
      noBackground={meansOfPayment !== undefined}
    />
  );
}
