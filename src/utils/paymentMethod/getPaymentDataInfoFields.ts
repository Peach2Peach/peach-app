// import from the types module directly: going through the store's index
// would pull the whole zustand store into every payment-data util
import { PaymentDataInfoFields } from "../../store/usePaymentDataStore/types";
import { isDefined } from "../validation/isDefined";

type ItemWithUnknownValue = { field: PaymentDataField; value?: string };
type Item = { field: PaymentDataField; value: string };
const isItemDefined = (item?: ItemWithUnknownValue): item is Item =>
  !!item && isDefined(item.field) && isDefined(item.value);

export const getPaymentDataInfoFields = (
  paymentData: PaymentDataInfo | PaymentData,
) => {
  const result = PaymentDataInfoFields.map((field) => ({
    field,
    value: paymentData[field],
  })).filter(isItemDefined);
  return result;
};
