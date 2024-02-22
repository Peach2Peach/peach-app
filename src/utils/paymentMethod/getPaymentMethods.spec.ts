import {
  mopsA,
  mopsB,
  mopsC,
  mopsD,
} from "../../../tests/unit/data/meansOfPaymentData";
import { getPaymentMethods } from "./getPaymentMethods";

describe("getPaymentMethods", () => {
  it("gets all payment methods defined in means of payment", () => {
    expect(getPaymentMethods(mopsA)).toStrictEqual([
      "sepa",
      "paypal",
      "revolut",
    ]);
    expect(getPaymentMethods(mopsB)).toStrictEqual([
      "paypal",
      "wise",
      "revolut",
    ]);
    expect(getPaymentMethods(mopsC)).toStrictEqual(["paypal", "revolut"]);
    expect(getPaymentMethods(mopsD)).toStrictEqual(["paypal"]);
  });
});
