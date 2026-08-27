import { PaymentDataHashInfo } from "../../../utils/paymentMethod/hashPaymentData";
import { PaymentDetailInfo } from "../types";
import { extendPaymentDetailInfo } from "./extendPaymentDetailInfo";

describe("extendPaymentDetailInfo", () => {
  const emptyObject: PaymentDetailInfo = {};
  const hashInfo: PaymentDataHashInfo = {
    field: "iban",
    value: "IE29AIBK93115212345678",
    hash: "0555f1f0ae95f1bfeac56dcab60f65639dc0e2c106eeada324717594d368a4d5",
  };
  const hashInfo2: PaymentDataHashInfo = {
    field: "phone",
    value: "+412134245",
    hash: "9e425d9336fff33cbececf474fad2360fbe674b442f1adf789bb8f96234dcc87",
  };
  const expected1 = {
    iban: {
      "0555f1f0ae95f1bfeac56dcab60f65639dc0e2c106eeada324717594d368a4d5":
        "IE29AIBK93115212345678",
    },
  };
  const expected2 = {
    iban: {
      "0555f1f0ae95f1bfeac56dcab60f65639dc0e2c106eeada324717594d368a4d5":
        "IE29AIBK93115212345678",
    },
    phone: {
      "9e425d9336fff33cbececf474fad2360fbe674b442f1adf789bb8f96234dcc87":
        "+412134245",
    },
  };
  it("adds payment data", () => {
    expect(extendPaymentDetailInfo(emptyObject, hashInfo)).toEqual(expected1);
    expect(extendPaymentDetailInfo(expected1, hashInfo2)).toEqual(expected2);
  });
});
