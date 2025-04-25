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
        field: "iban",
        value: "IE29 AIBK 9311 5212 3456 78",
      },
      {
        field: "bic",
        value: "AAAA BB CC 123",
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
});
