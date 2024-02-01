import { somePaymentDataExists } from "./somePaymentDataExists";
import {
  invalidSEPADataCurrency,
  missingSEPAData,
  validCashData,
  validSEPAData,
} from "../../../tests/unit/data/paymentData";

describe("somePaymentDataExists", () => {
  it("checks if payment at least some relevant payment data exists", () => {
    expect(somePaymentDataExists(validSEPAData)).toBeTruthy();
    expect(somePaymentDataExists(invalidSEPADataCurrency)).toBeTruthy();
    expect(somePaymentDataExists(missingSEPAData)).toBeFalsy();
  });
  it("return true for cash trades", () => {
    expect(somePaymentDataExists(validCashData)).toBeTruthy();
  });
});
