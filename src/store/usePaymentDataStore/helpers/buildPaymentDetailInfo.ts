import { hashPaymentData } from "../../../utils/paymentMethod/hashPaymentData";
import { PaymentDetailInfo } from "../types";
import { extendPaymentDetailInfo } from "./extendPaymentDetailInfo";

export const buildPaymentDetailInfo = (data: PaymentData) => {
  const hashes = hashPaymentData(data);
  return hashes.reduce(extendPaymentDetailInfo, {} satisfies PaymentDetailInfo);
};
