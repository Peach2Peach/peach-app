import { useMemo } from "react";
import { PaymentMethod } from "../../peach-api/src/@types/payment";
import i18n from "../utils/i18n";
import { usePaymentMethods } from "../views/addPaymentMethod/usePaymentMethodInfo";
import { SelectionDrawer } from "./SelectionDrawer";

interface PaymentMethodsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPaymentMethods: PaymentMethod[];
  onTogglePaymentMethod: (paymentMethod: PaymentMethod) => void;
}

export function PaymentMethodsDrawer({
  isOpen,
  onClose,
  selectedPaymentMethods,
  onTogglePaymentMethod,
}: PaymentMethodsDrawerProps) {
  const { data: paymentMethods } = usePaymentMethods();

  const items = useMemo(() => {
    if (!paymentMethods) return [];

    return paymentMethods.map((paymentMethod) => ({
      text: i18n(`paymentMethod.${paymentMethod.id}`),
      onPress: () => onTogglePaymentMethod(paymentMethod.id),
      isSelected: selectedPaymentMethods.some((pm) => pm === paymentMethod.id),
    }));
  }, [paymentMethods, selectedPaymentMethods, onTogglePaymentMethod]);

  if (!paymentMethods) return null;

  return (
    <SelectionDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        selectedPaymentMethods.length > 0
          ? `${i18n("paymentMethods.title")} (${selectedPaymentMethods.length})`
          : i18n("paymentMethods.title")
      }
      items={items}
      type="checkbox"
    />
  );
}
