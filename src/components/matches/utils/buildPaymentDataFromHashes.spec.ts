import {
  twintData,
  validCashData,
  validSEPAData,
  validSEPADataHashes,
} from "../../../../tests/unit/data/paymentData";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { buildPaymentDataFromHashes } from "./buildPaymentDataFromHashes";

describe("buildPaymentDataFromHashes", () => {
  const paymentMethod = "sepa";

  beforeEach(() => {
    usePaymentDataStore.getState().reset();
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    usePaymentDataStore.getState().addPaymentData(twintData);
    usePaymentDataStore.getState().addPaymentData(validCashData);
  });
  it("should (re-)build payment data from given hashes and payment method", () => {
    expect(
      buildPaymentDataFromHashes(validSEPADataHashes, paymentMethod),
    ).toEqual(validSEPAData);
  });
  it("should return undefined if partial payment data cannot be found", () => {
    usePaymentDataStore.getState().reset();
    expect(
      buildPaymentDataFromHashes(validSEPADataHashes, paymentMethod),
    ).toBeUndefined();
  });
  it("should return error if actual payment data cannot be found", () => {
    usePaymentDataStore.setState({ paymentData: {} });
    expect(
      buildPaymentDataFromHashes(validSEPADataHashes, paymentMethod),
    ).toBeUndefined();
  });
  it("should not return undefined for cash trades without payment data", () => {
    expect(buildPaymentDataFromHashes([], validCashData.type)).toEqual(
      validCashData,
    );
  });
  it("should search for legacy hashes as last resort", () => {
    expect(
      buildPaymentDataFromHashes(
        ["5dee7a784e8d09d7627d8b5c8768f2ec159225ba8c5013055b3c189490d7f10b"],
        paymentMethod,
      ),
    ).toEqual(validSEPAData);
  });
});
