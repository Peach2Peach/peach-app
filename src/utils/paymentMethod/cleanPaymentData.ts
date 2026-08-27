import { getPaymentDataInfoFields } from "./getPaymentDataInfoFields";

export const cleanPaymentData = (data: PaymentDataInfo | PaymentData) =>
  getPaymentDataInfoFields(data).reduce(
    (obj: PaymentDataInfo, { field, value }) => ({
      ...obj,
      [field]: value,
    }),
    {},
  );
