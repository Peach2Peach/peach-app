import {
  mopsA,
  mopsB,
  mopsC,
  mopsD,
} from "../../../tests/unit/data/meansOfPaymentData";
import { getCurrencies } from "./getCurrencies";

describe("getCurrencies", () => {
  it("gets all currencies defined in means of payment", () => {
    expect(getCurrencies(mopsA)).toStrictEqual(["EUR", "CHF", "GBP"]);
    expect(getCurrencies(mopsB)).toStrictEqual(["EUR", "CHF"]);
    expect(getCurrencies(mopsC)).toStrictEqual(["EUR"]);
    expect(getCurrencies(mopsD)).toStrictEqual(["EUR", "CHF"]);
  });
});
