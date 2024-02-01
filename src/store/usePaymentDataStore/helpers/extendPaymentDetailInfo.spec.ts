import { PaymentDataHashInfo } from "../../../utils/paymentMethod/hashPaymentData";
import { PaymentDetailInfo } from "../types";
import { extendPaymentDetailInfo } from "./extendPaymentDetailInfo";

describe("extendPaymentDetailInfo", () => {
  const emptyObject: PaymentDetailInfo = {};
  const hashInfo: PaymentDataHashInfo = {
    field: "iban",
    value: "IE29 AIBK 9311 5212 3456 78",
    hash: "8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3",
  };
  const hashInfo2: PaymentDataHashInfo = {
    field: "phone",
    value: "+412134245",
    hash: "9e425d9336fff33cbececf474fad2360fbe674b442f1adf789bb8f96234dcc87",
  };
  const expected1 = {
    iban: {
      "8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3":
        "IE29 AIBK 9311 5212 3456 78",
    },
  };
  const expected2 = {
    iban: {
      "8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3":
        "IE29 AIBK 9311 5212 3456 78",
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
