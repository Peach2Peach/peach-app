import {
  invalidSEPADataCurrency,
  missingSEPAData,
  validCashData,
  validSEPAData,
} from "../../../tests/unit/data/paymentData";
import { isValidPaymentData } from "./isValidPaymentData";

describe("isValidPaymentData", () => {
  it("checks if at least non metadata payment data exists", () => {
    expect(isValidPaymentData(validSEPAData)).toBe(true);
    expect(isValidPaymentData(validCashData)).toBe(true);
    expect(isValidPaymentData(invalidSEPADataCurrency)).toBe(false);
    expect(isValidPaymentData(missingSEPAData)).toBe(false);
  });
});
