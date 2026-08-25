import { twintData, validSEPAData } from "../../../tests/unit/data/paymentData";
import { hashPaymentData } from "./hashPaymentData";

describe("hashPaymentData", () => {
  it("should hash every relevant payment data field", () => {
    expect(hashPaymentData(validSEPAData)).toEqual([
      {
        field: "iban",
        value: "IE29AIBK93115212345678",
        hash: "0555f1f0ae95f1bfeac56dcab60f65639dc0e2c106eeada324717594d368a4d5",
      },
    ]);
    expect(hashPaymentData(twintData)).toEqual([
      {
        field: "phone",
        value: "+341234875987",
        hash: "c56ab971aeea3e5aa3d2e62e4ed7cb5488a63b0659e6db7b467e7f899cb7b418",
      },
    ]);
  });
  it("does not hash empty data", () => {
    expect(
      hashPaymentData({
        ...twintData,
        phone: "",
      }),
    ).toEqual([]);
  });
  it("does not hash irrelevant data", () => {
    expect(
      hashPaymentData({
        id: "test",
        label: "label",
        type: "sepa",
        currencies: ["EUR"],
      }),
    ).toEqual([]);
  });

  it("hashes an IBAN saved by an older app version like a normalized one", () => {
    expect(
      hashPaymentData({
        ...validSEPAData,
        iban: "ie29 aibk 9311 5212 3456 78",
      }),
    ).toEqual(hashPaymentData(validSEPAData));
  });
});
