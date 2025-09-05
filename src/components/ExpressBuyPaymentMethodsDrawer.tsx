import { PaymentMethod } from "../../peach-api/src/@types/payment";
import { useOfferPreferences } from "../store/offerPreferenes";
import { PaymentMethodsDrawer } from "./PaymentMethodsDrawer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: Partial<Record<PaymentMethod, number>>;
}
export function ExpressBuyPaymentMethodsDrawer({
  isOpen,
  onClose,
  stats,
}: Props) {
  const selectedPaymentMethods = useOfferPreferences(
    (state) => state.expressBuyFilterByPaymentMethodList,
  );
  const setExpressBuyFilterByPaymentMethodList = useOfferPreferences(
    (state) => state.setExpressBuyFilterByPaymentMethodList,
  );
  const onTogglePaymentMethod = (paymentMethod: PaymentMethod) => {
    const isSelected = selectedPaymentMethods.some(
      (pm) => pm === paymentMethod,
    );
    if (isSelected) {
      setExpressBuyFilterByPaymentMethodList(
        selectedPaymentMethods.filter((pm) => pm !== paymentMethod),
      );
    } else {
      setExpressBuyFilterByPaymentMethodList([
        ...selectedPaymentMethods,
        paymentMethod,
      ]);
    }
  };

  // const { data: sellOfferPaymentMethods } = useQuery({
  //   queryKey: ["peach069expressBuySellOffers"],
  //   queryFn: async () => {
  //     const { result } = await peachAPI.private.peach069.getSellOffers({});
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
