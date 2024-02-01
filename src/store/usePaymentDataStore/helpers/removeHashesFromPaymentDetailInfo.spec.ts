import {
  paymentDetailInfo,
  twintData,
  twintDataHashes,
  validSEPAData,
} from "../../../../tests/unit/data/paymentData";
import { removeHashesFromPaymentDetailInfo } from "./removeHashesFromPaymentDetailInfo";

describe("removeHashesFromPaymentDetailInfo", () => {
  it("removes hashes of payment data", () => {
    expect(
      removeHashesFromPaymentDetailInfo(paymentDetailInfo, validSEPAData),
    ).toEqual({
      iban: {},
      phone: { [twintDataHashes[0]]: twintData.phone },
    });
  });
});
