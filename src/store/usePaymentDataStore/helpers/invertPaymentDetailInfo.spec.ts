import {
  paymentDetailInfo,
  paymentDetailInfoInverted,
} from "../../../../tests/unit/data/paymentData";
import { invertPaymentDetailInfo } from "./invertPaymentDetailInfo";

describe("invertPaymentDetailInfo", () => {
  it("adds payment data", () => {
    expect(invertPaymentDetailInfo(paymentDetailInfo)).toEqual(
      paymentDetailInfoInverted,
    );
  });
});
