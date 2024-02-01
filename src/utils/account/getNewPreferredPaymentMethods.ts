import { keys } from "../object/keys";

export const getNewPreferredPaymentMethods = (
  preferredPaymentMethods: Partial<Record<PaymentMethod, string>>,
  updateDatedPaymentData: PaymentData[],
) =>
  keys(preferredPaymentMethods).reduce(
    (obj, method) => {
      const id = preferredPaymentMethods[method];
      const data = updateDatedPaymentData.find((d) => d.id === id);
      let newObj = { ...obj };
      if (data && !data.hidden) newObj = { ...newObj, [method]: id };
      return newObj;
    },
    {} satisfies Partial<Record<PaymentMethod, string>>,
  );
