import { addPaymentDetailInfoByHash } from "./addPaymentDetailInfoByHash";
import {
  paymentDetailInfo,
  twintDataHashes,
  validSEPADataHashes,
} from "../../../../tests/unit/data/paymentData";

describe("addPaymentDetailInfoByHash", () => {
  const emptyPaymentData: PaymentDataInfo = {};
  it("finds payment detail info by hash and adds it to the object", () => {
    expect(
      addPaymentDetailInfoByHash(paymentDetailInfo)(
        emptyPaymentData,
        twintDataHashes[0],
      ),
    ).toEqual({
      phone: paymentDetailInfo.phone?.[twintDataHashes[0]],
    });
    expect(
      addPaymentDetailInfoByHash(paymentDetailInfo)(
        emptyPaymentData,
        validSEPADataHashes[0],
      ),
    ).toEqual({
      iban: "IE29 AIBK 9311 5212 3456 78",
    });
  });
  it("finds returns the object as is if hash could not be found", () => {
    expect(
      addPaymentDetailInfoByHash(paymentDetailInfo)(
        emptyPaymentData,
        "otherhash",
      ),
    ).toEqual(emptyPaymentData);
  });
});
