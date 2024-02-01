import { validSEPAData } from "../../../../tests/unit/data/paymentData";
import { buildPaymentDetailInfo } from "./buildPaymentDetailInfo";

describe("buildPaymentDetailInfo", () => {
  it("adds payment data", () => {
    expect(buildPaymentDetailInfo(validSEPAData)).toEqual({
      iban: {
        "8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3":
          "IE29 AIBK 9311 5212 3456 78",
      },
    });
  });
});
