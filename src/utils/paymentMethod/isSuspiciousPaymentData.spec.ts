import {
  validSEPAData,
  validSEPADataHashes,
} from "../../../tests/unit/data/paymentData";
import { isSuspiciousPaymentData } from "./isSuspiciousPaymentData";

describe("isSuspiciousPaymentData", () => {
  it("is not suspicious when the data matches the published hashes", () => {
    expect(isSuspiciousPaymentData(validSEPAData, validSEPADataHashes)).toBe(
      false,
    );
  });
  it("is suspicious when the data does not match the published hashes", () => {
    expect(
      isSuspiciousPaymentData(
        { ...validSEPAData, iban: "IE64IRCE92050112345678" },
        validSEPADataHashes,
      ),
    ).toBe(true);
  });
  it("is suspicious when the IBAN is not in canonical form, even if the hashes match", () => {
    const iban = "IE29 AIBK 9311 5212 3456 78";
    // the hashes still match: hashing normalizes the IBAN before hashing it
    expect(
      isSuspiciousPaymentData({ ...validSEPAData, iban }, validSEPADataHashes),
    ).toBe(true);
  });
  it("is not suspicious when there is no payment data to check", () => {
    expect(isSuspiciousPaymentData(undefined, validSEPADataHashes)).toBe(false);
  });
});
