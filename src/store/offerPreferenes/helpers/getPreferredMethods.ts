import { usePaymentDataStore } from "../../usePaymentDataStore";

export const getPreferredMethods = (ids: string[]) =>
  ids.reduce((obj: Partial<Record<PaymentMethod, string>>, id) => {
    const method = usePaymentDataStore.getState().paymentData[id]?.type;
    if (method) return { ...obj, [method]: id };
    return obj;
  }, {});
