import { useOfferPreferences } from "../../../store/offerPreferenes";
import { Methods } from "./Methods";

export function PreferenceMethods({
  type,
  setCurrency,
}: {
  type: "buy" | "sell";
  setCurrency: (c: Currency) => void;
}) {
  const meansOfPayment = useOfferPreferences((state) => state.meansOfPayment);

  return (
    <Methods
      type={type}
      meansOfPayment={meansOfPayment}
      setCurrency={setCurrency}
    />
  );
}
