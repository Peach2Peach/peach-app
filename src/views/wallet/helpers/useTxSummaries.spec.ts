import { renderHook } from "test-utils";
import {
  confirmed1,
  confirmed2,
} from "../../../../tests/unit/data/transactionDetailData";
import { MSINASECOND } from "../../../constants";
import {
  defaultWalletState,
  useWalletState,
} from "../../../utils/wallet/walletStore";
import { useTxSummaries } from "./useTxSummaries";

jest.useFakeTimers();

describe("useTxSummaries", () => {
  beforeEach(() => {
    useWalletState.setState(defaultWalletState);
  });
  it("should return an array of queries", () => {
    const { result } = renderHook(useTxSummaries);
    expect(result.current).toBeInstanceOf(Array);
  });
  it("should return an array of queries with the same length as the transactions", () => {
    useWalletState.setState({ transactions: [confirmed1, confirmed2] });
    const { result } = renderHook(useTxSummaries);
    expect(result.current).toHaveLength(2);
  });
  it("should return a summarized version of the transactions", () => {
    useWalletState.setState({ transactions: [confirmed1, confirmed2] });
    const { result } = renderHook(useTxSummaries);
    expect(result.current[0].data).toEqual({
      id: confirmed1.txid,
      type: "WITHDRAWAL",
      chain: "bitcoin",
      offerData: [],
      amount: 0,
      date: new Date(MSINASECOND),
      height: 1,
      confirmed: true,
    });
    expect(result.current[1].data).toEqual({
      id: confirmed2.txid,
      type: "WITHDRAWAL",
      chain: "bitcoin",
      offerData: [],
      amount: 0,
      date: new Date(2 * MSINASECOND),
      height: 2,
      confirmed: true,
    });
  });
});
