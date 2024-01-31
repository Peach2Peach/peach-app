import { ok } from "assert";
import {
  invalidSEPADataCurrency,
  missingSEPAData,
  validCashData,
  validSEPAData,
} from "../../../tests/unit/data/paymentData";
import { isValidPaymentData } from "./isValidPaymentData";

describe("isValidPaymentData", () => {
  it("checks if at least non metadata payment data exists", () => {
    ok(isValidPaymentData(validSEPAData));
    ok(isValidPaymentData(validCashData));
    ok(!isValidPaymentData(invalidSEPADataCurrency));
    ok(!isValidPaymentData(missingSEPAData));
  });
});
