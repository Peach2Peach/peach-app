import { omit } from "../../../utils/object/omit";
import { getPaymentDataInfoFields } from "../../../utils/paymentMethod/getPaymentDataInfoFields";
import { PaymentDetailInfo } from "../types";
import { invertPaymentDetailInfo } from "./invertPaymentDetailInfo";

export const removeHashesFromPaymentDetailInfo = (
  paymentDetailInfo: PaymentDetailInfo,
  data: PaymentData,
) => {
  const invertedPaymentDetailInfo = invertPaymentDetailInfo(paymentDetailInfo);
  const pamentDetailInfoToRemove = getPaymentDataInfoFields(data);
  pamentDetailInfoToRemove.forEach(({ field, value }) => {
    const invertedHashMap = invertedPaymentDetailInfo[field];
    if (invertedHashMap)
      invertedPaymentDetailInfo[field] = omit(invertedHashMap, value);
  });
  return invertPaymentDetailInfo(invertedPaymentDetailInfo);
};
