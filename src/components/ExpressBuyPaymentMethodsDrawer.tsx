import { useQuery } from "@tanstack/react-query";
import { PaymentMethod } from "../../peach-api/src/@types/payment";
import { useOfferPreferences } from "../store/offerPreferenes";
import { peachAPI } from "../utils/peachAPI";
import { PaymentMethodsDrawer } from "./PaymentMethodsDrawer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
export function ExpressBuyPaymentMethodsDrawer({ isOpen, onClose }: Props) {
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

  const onReset = () => setExpressBuyFilterByPaymentMethodList([]);

  const { data: sellOfferPaymentMethods } = useQuery({
    queryKey: ["peach069expressBuySellOffers", "stats", "paymentMethods"],
    queryFn: async () => {
      const { result } = await peachAPI.private.peach069.getSellOffers({});
      return result?.stats.paymentMethods;
    },
  });

  return (
    <PaymentMethodsDrawer
      isOpen={isOpen}
      onClose={onClose}
      selectedPaymentMethods={selectedPaymentMethods}
      onTogglePaymentMethod={onTogglePaymentMethod}
      paymentMethodOfferAmounts={sellOfferPaymentMethods}
      onReset={onReset}
    />
  );
}
