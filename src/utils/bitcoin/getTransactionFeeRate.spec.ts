// @ts-nocheck
/* eslint-disable no-magic-numbers */
import { bdkTransactionWithoutRBF1 } from "../../../tests/unit/data/transactionDetailData";
import { getTransactionFeeRate } from "./getTransactionFeeRate";

describe("getTransactionFeeRate", () => {
  it("should calculate the fee rate", () => {
    const tx = {
      ...bdkTransactionWithoutRBF1,
      transaction: { ...bdkTransactionWithoutRBF1.transaction!, vsize: 347.25 },
    };
    expect(getTransactionFeeRate(tx)).toBe(386.01);
  });
});
