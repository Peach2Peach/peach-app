import { PaymentMethod } from "../../peach-api/src/@types/payment";
import { useOfferPreferences } from "../store/offerPreferenes";
import { PaymentMethodsDrawer } from "./PaymentMethodsDrawer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpressSellPaymentMethodsDrawer({ isOpen, onClose }: Props) {
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

  return (
    <PaymentMethodsDrawer
      isOpen={isOpen}
      onClose={onClose}
      selectedPaymentMethods={selectedPaymentMethods}
      onTogglePaymentMethod={onTogglePaymentMethod}
    />
  );
}
