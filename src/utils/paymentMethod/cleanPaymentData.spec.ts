import { validSEPAData } from "../../../tests/unit/data/paymentData";
import { cleanPaymentData } from "./cleanPaymentData";

describe("cleanPaymentData", () => {
  it("should remove all metadata from payment data", () => {
    expect(cleanPaymentData(validSEPAData)).toEqual({
      beneficiary: "Hal Finney",
      iban: "IE29AIBK93115212345678",
      bic: "AAAA BB CC 123",
    });
  });
});
