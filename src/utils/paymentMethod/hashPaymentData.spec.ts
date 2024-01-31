import { twintData, validSEPAData } from "../../../tests/unit/data/paymentData";
import { hashPaymentData } from "./hashPaymentData";

describe("hashPaymentData", () => {
  it("should hash every relevant payment data field", () => {
    expect(hashPaymentData(validSEPAData)).toEqual([
      {
        field: "iban",
        value: "IE29 AIBK 9311 5212 3456 78",
        hash: "8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3",
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
});
