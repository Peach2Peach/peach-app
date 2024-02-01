import { validSEPAData } from "../../../tests/unit/data/paymentData";
import { cleanPaymentData } from "./cleanPaymentData";

describe("cleanPaymentData", () => {
  it("should remove all metadata from payment data", () => {
    expect(cleanPaymentData(validSEPAData)).toEqual({
      beneficiary: "Hal Finney",
      iban: "IE29 AIBK 9311 5212 3456 78",
      bic: "AAAA BB CC 123",
    });
  });
});
