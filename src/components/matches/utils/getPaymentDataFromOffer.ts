import {
  PaymentDataInfoFields,
  usePaymentDataStore,
} from "../../../store/usePaymentDataStore";
import { sha256 } from "../../../utils/crypto/sha256";
import { keys } from "../../../utils/object/keys";
import { omit } from "../../../utils/object/omit";
import { cleanPaymentData } from "../../../utils/paymentMethod/cleanPaymentData";
import { isCashTrade } from "../../../utils/paymentMethod/isCashTrade";

export function getPaymentDataFromOffer(
  offer: BuyOffer | SellOffer,
  paymentMethod: PaymentMethod,
) {
  const hashes = offer.paymentData[paymentMethod]?.hashes;
  if (!hashes) return { error: "MISSING_HASHED_PAYMENT_DATA" } as const;

  const paymentData = buildPaymentDataFromHashes(hashes, paymentMethod);
  if (!paymentData) return { error: "MISSING_PAYMENTDATA" } as const;
  return { paymentData } as const;
}

function buildPaymentDataFromHashes(
  hashes: string[],
  selectedPaymentMethod: PaymentMethod,
) {
  const paymentDataArray = Object.values(
    usePaymentDataStore.getState().paymentData,
  );
  const partialPaymentData = isCashTrade(selectedPaymentMethod)
    ? { type: selectedPaymentMethod }
    : hashes.reduce((obj, hash) => {
        for (const paymentDataField of PaymentDataInfoFields) {
          const hashMap =
            usePaymentDataStore.getState().paymentDetailInfo[paymentDataField];
          if (hashMap && !!hashMap[hash]) {
            return {
              ...obj,
              [paymentDataField]: hashMap[hash],
            };
          }
        }
        return obj;
      }, {} satisfies PaymentDataInfo);

  if (Object.keys(partialPaymentData).length === 0) {
    if (hashes.length === 1)
      return paymentDataArray.find((data) => {
        const cleanedData = cleanPaymentData(data);
        const dataWithoutReference = omit(cleanedData, "reference");
        const dataHash = sha256(
          JSON.stringify(dataWithoutReference).toLowerCase(),
        );
        return data.type === selectedPaymentMethod && dataHash === hashes[0];
      });
    return undefined;
  }

  const paymentData = paymentDataArray.find(
    (data) =>
      selectedPaymentMethod === data.type &&
      keys(partialPaymentData).every(
        (key) => key in data && partialPaymentData[key] === data[key],
      ),
  );

  return paymentData;
}
