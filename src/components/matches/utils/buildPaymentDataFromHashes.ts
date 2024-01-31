import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { sha256 } from "../../../utils/crypto/sha256";
import { omit } from "../../../utils/object/omit";
import { cleanPaymentData } from "../../../utils/paymentMethod/cleanPaymentData";
import { isCashTrade } from "../../../utils/paymentMethod/isCashTrade";
import { addPaymentDetailInfoByHash } from "./addPaymentDetailInfoByHash";

const findPaymentDataByLegacyHash = (hash: string) => {
  const paymentData = usePaymentDataStore.getState().getPaymentDataArray();
  return paymentData.find((data) => {
    const cleanedData = cleanPaymentData(data);
    const dataWithoutReference = omit(cleanedData, "reference");
    const dataHash = sha256(JSON.stringify(dataWithoutReference).toLowerCase());
    return dataHash === hash;
  });
};
export const buildPaymentDataFromHashes = (
  hashes: string[],
  selectedPaymentMethod: PaymentMethod,
) => {
  const partialPaymentData = isCashTrade(selectedPaymentMethod)
    ? { type: selectedPaymentMethod }
    : hashes.reduce(
        addPaymentDetailInfoByHash(
          usePaymentDataStore.getState().paymentDetailInfo,
        ),
        {} satisfies PaymentDataInfo,
      );

  if (Object.keys(partialPaymentData).length === 0) {
    if (hashes.length === 1) return findPaymentDataByLegacyHash(hashes[0]);
    return undefined;
  }

  return usePaymentDataStore
    .getState()
    .searchPaymentData(partialPaymentData)[0];
};
