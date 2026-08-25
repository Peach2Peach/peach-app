import {
  liquidData,
  twintData,
  validSEPAData,
} from "../../../tests/unit/data/paymentData";
import { getPaymentDataInfoFields } from "./getPaymentDataInfoFields";

describe("getPaymentDataInfoFields", () => {
  it("should return relevant payment data fields", () => {
    expect(getPaymentDataInfoFields(validSEPAData)).toEqual([
      {
        field: "beneficiary",
        value: "Hal Finney",
      },
      {
        field: "bic",
        value: "AAAA BB CC 123",
      },
      {
        field: "iban",
        value: "IE29AIBK93115212345678",
      },
    ]);
    expect(getPaymentDataInfoFields(twintData)).toEqual([
      {
        field: "phone",
        value: "+341234875987",
      },
    ]);
    expect(getPaymentDataInfoFields(liquidData)).toEqual([
      {
        field: "receiveAddress",
        value:
          "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
      },
    ]);
  });

  it("normalizes an IBAN saved by an older app version", () => {
    expect(
      getPaymentDataInfoFields({
        ...validSEPAData,
        iban: "ie29 aibk 9311 5212 3456 78",
      }),
    ).toContainEqual({
      field: "iban",
      value: "IE29AIBK93115212345678",
    });
  });
});
