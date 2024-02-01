import { PaymentDataHashInfo } from "../../../utils/paymentMethod/hashPaymentData";
import { PaymentDetailInfo } from "../types";

export const extendPaymentDetailInfo = (
  obj: PaymentDetailInfo,
  { field, value, hash }: PaymentDataHashInfo,
) => {
  obj[field] = { ...obj[field], [hash]: value };
  return obj;
};
