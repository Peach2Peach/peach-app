// import from the types module directly: going through the store's index
// would pull the whole zustand store into every payment-data util
import { PaymentDataInfoFields } from "../../store/usePaymentDataStore/types";
import { normalizeIBAN } from "../format/normalizeIBAN";
import { isDefined } from "../validation/isDefined";

type ItemWithUnknownValue = { field: PaymentDataField; value?: string };
type Item = { field: PaymentDataField; value: string };
const isItemDefined = (item?: ItemWithUnknownValue): item is Item =>
  !!item && isDefined(item.field) && isDefined(item.value);

/**
 * Normalizing here rather than at the call sites means both the encrypted
 * payload (`cleanPaymentData`) and the published hashes (`hashPaymentData`)
 * are derived from the exact same value, and that payment data saved by an
 * older app version is healed the next time it is published.
 */
const normalizeValue = (field: PaymentDataField, value: string) =>
  field === "iban" ? normalizeIBAN(value) : value;

export const getPaymentDataInfoFields = (
  paymentData: PaymentDataInfo | PaymentData,
) => {
  const result = PaymentDataInfoFields.map((field) => ({
    field,
    value: paymentData[field],
  }))
    .filter(isItemDefined)
    .map(({ field, value }) => ({
      field,
      value: normalizeValue(field, value),
    }));
  return result;
};
