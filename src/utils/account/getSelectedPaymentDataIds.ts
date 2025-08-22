import { keys } from "../object/keys";

export const getSelectedPaymentDataIds = (
  preferredPaymentMethods: Partial<Record<PaymentMethod, string>>,
) =>
  keys(preferredPaymentMethods).reduce((arr: string[], type: PaymentMethod) => {
    const id = preferredPaymentMethods[type];
    if (!id) return arr;
    return arr.concat(id);
  }, []);
