import {
  twintData,
  twintDataHashes,
  validSEPAData,
  validSEPADataHashes,
} from "../../../../tests/unit/data/paymentData";
import { getHashedPaymentData } from "./getHashedPaymentData";

describe("getHashedPaymentData", () => {
  it("should return the expected object", () => {
    const mockData: PaymentData[] = [validSEPAData, twintData];
    const expected = {
      sepa: {
        hashes: validSEPADataHashes,
        country: undefined,
      },
      twint: {
        hashes: twintDataHashes,
        country: undefined,
      },
    };
    expect(getHashedPaymentData(mockData)).toEqual(expected);
  });
});
