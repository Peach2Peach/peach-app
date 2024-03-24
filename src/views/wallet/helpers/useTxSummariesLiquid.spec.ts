import { renderHook } from "test-utils";
import { transaction } from "../../../../tests/unit/data/liquidBlockExplorerData";
import { useLiquidWalletState } from "../../../utils/wallet/useLiquidWalletState";
import { useTxSummariesLiquid } from "./useTxSummariesLiquid";

jest.useFakeTimers();

describe("useTxSummariesLiquid", () => {
  beforeEach(() => {
    useLiquidWalletState.getState().reset();
  });
  it("should return an array of queries", () => {
    const { result } = renderHook(useTxSummariesLiquid);
    expect(result.current).toBeInstanceOf(Array);
  });
  it("should return an array of queries with the same length as the transactions", () => {
    useLiquidWalletState.setState({ transactions: [transaction] });
    const { result } = renderHook(useTxSummariesLiquid);
    expect(result.current).toHaveLength(1);
  });
  it("should return a summarized version of the transactions", () => {
    useLiquidWalletState.setState({ transactions: [transaction] });
    const { result } = renderHook(useTxSummariesLiquid);
    expect(result.current[0].data).toEqual({
      id: "b6e8dbcae9753352dd88bf57cd30f20c73445794544d05dd5f889d83f2d25486",
      type: "DEPOSIT",
      amount: 0,
      date: new Date("2024-03-14T13:43:00.000Z"),
      height: 2,
      confirmed: true,
      chain: "liquid",
      offerData: [],
    });
  });
});
