import {
  invalidSEPADataCurrency,
  missingSEPAData,
  validCashData,
  validSEPAData,
} from "../../../tests/unit/data/paymentData";
import { useConfigStore } from "../../store/configStore/configStore";
import { isValidPaymentData } from "./isValidPaymentData";

describe("isValidPaymentData", () => {
  it("checks if at least non metadata payment data exists", () => {
    useConfigStore.getState().setPaymentMethods([
      {
        id: "sepa",
        currencies: ["EUR"],
        anonymous: false,
        fields: {
          mandatory: [[["iban"]]],
          optional: [],
        },
      },
      {
        id: "cash.de",
        currencies: ["EUR"],
        anonymous: false,
        fields: {
          mandatory: [],
          optional: [],
        },
      },
    ]);
    expect(isValidPaymentData(validSEPAData)).toBe(true);
    expect(isValidPaymentData(validCashData)).toBe(true);
    expect(isValidPaymentData(invalidSEPADataCurrency)).toBe(false);
    expect(isValidPaymentData(missingSEPAData)).toBe(false);
  });
});
