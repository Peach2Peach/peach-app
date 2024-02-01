import { deepStrictEqual } from "assert";
import {
  mopsA,
  mopsB,
  mopsC,
  mopsD,
} from "../../../tests/unit/data/meansOfPaymentData";
import { getPaymentMethods } from "./getPaymentMethods";

describe("getPaymentMethods", () => {
  it("gets all payment methods defined in means of payment", () => {
    deepStrictEqual(getPaymentMethods(mopsA), ["sepa", "paypal", "revolut"]);
    deepStrictEqual(getPaymentMethods(mopsB), ["paypal", "wise", "revolut"]);
    deepStrictEqual(getPaymentMethods(mopsC), ["paypal", "revolut"]);
    deepStrictEqual(getPaymentMethods(mopsD), ["paypal"]);
  });
});
