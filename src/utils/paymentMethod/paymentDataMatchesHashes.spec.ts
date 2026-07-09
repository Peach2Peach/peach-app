import { twintData, validSEPAData } from "../../../tests/unit/data/paymentData";
import { hashPaymentData } from "./hashPaymentData";
import { paymentDataMatchesHashes } from "./paymentDataMatchesHashes";

const sepaHashes = hashPaymentData(validSEPAData).map((item) => item.hash);

describe("paymentDataMatchesHashes", () => {
  it("returns true when the recomputed hashes match the stored hashes", () => {
    expect(paymentDataMatchesHashes(validSEPAData, sepaHashes)).toBe(true);
  });

  it("returns false when a hashable field was tampered with", () => {
    const tampered = { ...validSEPAData, iban: "DE00 0000 0000 0000 0000 00" };
    expect(paymentDataMatchesHashes(tampered, sepaHashes)).toBe(false);
  });

  it("returns false when the stored hashes belong to different payment data", () => {
    const twintHashes = hashPaymentData(twintData).map((item) => item.hash);
    expect(paymentDataMatchesHashes(validSEPAData, twintHashes)).toBe(false);
  });

  it("returns true when there are no stored hashes to verify against", () => {
    expect(paymentDataMatchesHashes(validSEPAData, [])).toBe(true);
  });

  it("flags as suspicious when a non-empty stored blob contains no valid hash", () => {
    // e.g. a truncated / corrupted hash (63 chars) that no longer parses
    const truncated = [
      '{"twint":{"hashes":["c56ab971aeea3e5aa3d2e62e4ed7cb5488a63b0659e6db7b467e7f899cb7b41"]',
      '"isMpesa":false}}',
    ];
    expect(paymentDataMatchesHashes(twintData, truncated)).toBe(false);
  });

  it("matches hashes stored as a mangled, comma-split OfferPaymentData object", () => {
    const [{ hash }] = hashPaymentData(twintData);
    // how buyerHashedPaymentData arrives from the backend for some contracts
    const mangled = [`{"twint":{"hashes":["${hash}"]`, '"isMpesa":false}}'];
    expect(paymentDataMatchesHashes(twintData, mangled)).toBe(true);
  });

  it("flags tampering even when hashes are stored in the mangled format", () => {
    const [{ hash }] = hashPaymentData(twintData);
    const mangled = [`{"twint":{"hashes":["${hash}"]`, '"isMpesa":false}}'];
    const tampered = { ...twintData, phone: "+340000000000" };
    expect(paymentDataMatchesHashes(tampered, mangled)).toBe(false);
  });

  it("returns true when the payment data has no hashable fields", () => {
    const noHashableFields: PaymentData = {
      id: "test",
      label: "label",
      type: "sepa",
      currencies: ["EUR"],
    };
    expect(paymentDataMatchesHashes(noHashableFields, sepaHashes)).toBe(true);
  });
});
