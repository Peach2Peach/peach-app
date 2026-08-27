import { validSEPAData } from "../../../../tests/unit/data/paymentData";
import { buildPaymentDetailInfo } from "./buildPaymentDetailInfo";

describe("buildPaymentDetailInfo", () => {
  it("adds payment data", () => {
    expect(buildPaymentDetailInfo(validSEPAData)).toEqual({
      iban: {
        "0555f1f0ae95f1bfeac56dcab60f65639dc0e2c106eeada324717594d368a4d5":
          "IE29AIBK93115212345678",
      },
    });
  });
});
