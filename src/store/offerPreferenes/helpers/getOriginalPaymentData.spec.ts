import { validSEPAData } from "../../../../tests/unit/data/paymentData";
import { usePaymentDataStore } from "../../usePaymentDataStore";
import { getOriginalPaymentData } from "./getOriginalPaymentData";

describe("getOriginalPaymentData", () => {
  it("should return the expected object", () => {
    const mockData = { sepa: validSEPAData.id };
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    expect(getOriginalPaymentData(mockData)).toEqual([validSEPAData]);
  });
});
