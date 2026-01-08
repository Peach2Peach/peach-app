import { BumpFeeTxBuilder } from "bdk-rn";
import {
  bumpFeeTxBuilderAllowShrinkingMock,
  bumpFeeTxBuilderCreateMock,
  bumpFeeTxBuilderEnableRbfMock,
} from "../../../../tests/unit/mocks/bdkRN";
import { buildBumpFeeTransaction } from "./buildBumpFeeTransaction";

describe("buildBumpFeeTransaction", () => {
  it("creates a bump fee transaction", async () => {
    const txId = "txId";
    const feeRate = 10;

    const transactionResult = await buildBumpFeeTransaction(txId, feeRate);
    expect(bumpFeeTxBuilderCreateMock).toHaveBeenCalledWith(txId, feeRate);
    expect(bumpFeeTxBuilderEnableRbfMock).toHaveBeenCalled();

    expect(transactionResult).toBeInstanceOf(BumpFeeTxBuilder);
  });
  it("allows shrinking on passed address", async () => {
    const txId = "txId";
    const feeRate = 10;
    const address = "address";

    await buildBumpFeeTransaction(txId, feeRate);
    expect(bumpFeeTxBuilderAllowShrinkingMock).toHaveBeenCalledWith(address);
  });
});
