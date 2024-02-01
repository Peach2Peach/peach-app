import { invert } from "../../../utils/object/invert";
import { keys } from "../../../utils/object/keys";
import { PaymentDetailInfo } from "../types";

export const invertPaymentDetailInfo = (info: PaymentDetailInfo) => {
  const inverted: PaymentDetailInfo = {};
  keys(info).forEach((key) => {
    const item = info[key];
    if (item) inverted[key] = invert(item);
  });
  return inverted;
};
