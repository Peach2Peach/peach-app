import { PaymentMethod } from "../../peach-api/src/@types/payment";
import { useOfferPreferences } from "../store/offerPreferenes";
import { PaymentMethodsDrawer } from "./PaymentMethodsDrawer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: Partial<Record<PaymentMethod, number>>;
}

export function ExpressSellPaymentMethodsDrawer({
  isOpen,
  onClose,
  stats,
}: Props) {
  const selectedPaymentMethods = useOfferPreferences(
    (state) => state.expressSellFilterByPaymentMethodList,
  );
  const setExpressSellFilterByPaymentMethodList = useOfferPreferences(
    (state) => state.setExpressSellFilterByPaymentMethodList,
  );
  const onTogglePaymentMethod = (paymentMethod: PaymentMethod) => {
    const isSelected = selectedPaymentMethods.some(
      (pm) => pm === paymentMethod,
    );
    if (isSelected) {
      setExpressSellFilterByPaymentMethodList(
        selectedPaymentMethods.filter((pm) => pm !== paymentMethod),
      );
    } else {
      setExpressSellFilterByPaymentMethodList([
        ...selectedPaymentMethods,
        paymentMethod,
      ]);
    }
  };
  // const { data: buyOfferPaymentMethods } = useQuery({
  //   queryKey: ["peach069expressBuyOffers"],
  //   queryFn: async () => {
  //     const { result } = await peachAPI.private.peach069.getBuyOffers({});
  //     return result?.stats.paymentMethods;
  //   },
  // });

  return (
    <PaymentMethodsDrawer
      isOpen={isOpen}
      onClose={onClose}
      selectedPaymentMethods={selectedPaymentMethods}
      onTogglePaymentMethod={onTogglePaymentMethod}
      paymentMethodOfferAmounts={stats}
    />
  );
}
