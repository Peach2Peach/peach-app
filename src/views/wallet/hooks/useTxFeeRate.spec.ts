import { renderHook, waitFor } from "test-utils";
import { bdkTransactionWithRBF1 } from "../../../../tests/unit/data/transactionDetailData";
import { useTxFeeRate } from "./useTxFeeRate";

const feeRate = 10;
jest.mock("../../../utils/bitcoin/getTransactionFeeRate");
jest
  .requireMock("../../../utils/bitcoin/getTransactionFeeRate")
  .getTransactionFeeRate.mockResolvedValue(feeRate);
describe("useTxFeeRate", () => {
  const initialProps = {
    transaction: bdkTransactionWithRBF1,
  };
  it("returns tx fee rate", async () => {
    const { result } = renderHook(useTxFeeRate, { initialProps });
    await waitFor(() => expect(result.current.data).toEqual(feeRate));
  });
  it("returns 1 as fee rate if transaction is undefined", async () => {
    const { result } = renderHook(useTxFeeRate, {
      initialProps: { transaction: undefined },
    });
    await waitFor(() => expect(result.current.data).toEqual(1));
  });
});
