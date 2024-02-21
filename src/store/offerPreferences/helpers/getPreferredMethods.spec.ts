import {
  paypalData,
  revolutData,
  validSEPAData,
} from "../../../../tests/unit/data/paymentData";
import { usePaymentDataStore } from "../../usePaymentDataStore";
import { getPreferredMethods } from "./getPreferredMethods";

describe("getPreferredMethods", () => {
  it("should return the expected object", () => {
    const ids = [validSEPAData.id, revolutData.id];
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    usePaymentDataStore.getState().addPaymentData(revolutData);
    usePaymentDataStore.getState().addPaymentData(paypalData);

    expect(getPreferredMethods(ids)).toEqual({
      sepa: validSEPAData.id,
      revolut: revolutData.id,
    });
  });
});
