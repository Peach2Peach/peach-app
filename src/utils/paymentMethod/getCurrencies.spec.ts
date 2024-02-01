import { deepStrictEqual } from "assert";
import {
  mopsA,
  mopsB,
  mopsC,
  mopsD,
} from "../../../tests/unit/data/meansOfPaymentData";
import { getCurrencies } from "./getCurrencies";

describe("getCurrencies", () => {
  it("gets all currencies defined in means of payment", () => {
    deepStrictEqual(getCurrencies(mopsA), ["EUR", "CHF", "GBP"]);
    deepStrictEqual(getCurrencies(mopsB), ["EUR", "CHF"]);
    deepStrictEqual(getCurrencies(mopsC), ["EUR"]);
    deepStrictEqual(getCurrencies(mopsD), ["EUR", "CHF"]);
  });
});
