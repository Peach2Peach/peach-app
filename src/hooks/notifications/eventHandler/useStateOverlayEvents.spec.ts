import { act, renderHook } from "test-utils";
import { useTradeSummaryStore } from "../../../store/tradeSummaryStore";
import { useStateUpdateEvents } from "./useStateUpdateEvents";

jest.mock("../../../store/tradeSummaryStore", () => ({
  useTradeSummaryStore: jest.fn(),
}));

describe("useStateUpdateEvents", () => {
  it('should increment unreadMessages when "contract.chat" is received', () => {
    const contractId = "abc123";
    const getContract = jest.fn().mockReturnValue({ unreadMessages: 2 });
    const setContract = jest.fn();
    (useTradeSummaryStore as unknown as jest.Mock).mockReturnValue([
      getContract,
      setContract,
    ]);

    const { result } = renderHook(() => useStateUpdateEvents());

    act(() => {
      result.current["contract.chat"]?.({ contractId });
    });

    expect(getContract).toHaveBeenCalledWith(contractId);
    expect(setContract).toHaveBeenCalledWith(contractId, { unreadMessages: 3 });
  });

  it("should not update state if contractId is not provided", () => {
    const getContract = jest.fn();
    const setContract = jest.fn();
    (useTradeSummaryStore as unknown as jest.Mock).mockReturnValue([
      getContract,
      setContract,
    ]);

    const { result } = renderHook(() => useStateUpdateEvents());

    act(() => {
      result.current["contract.chat"]?.({});
    });

    expect(getContract).not.toHaveBeenCalled();
    expect(setContract).not.toHaveBeenCalled();
  });

  it("should not update state if contract is not found", () => {
    const contractId = "abc123";
    const getContract = jest.fn().mockReturnValue(undefined);
    const setContract = jest.fn();
    (useTradeSummaryStore as unknown as jest.Mock).mockReturnValue([
      getContract,
      setContract,
    ]);

    const { result } = renderHook(() => useStateUpdateEvents());

    act(() => {
      result.current["contract.chat"]?.({ contractId });
    });

    expect(getContract).toHaveBeenCalledWith(contractId);
    expect(setContract).not.toHaveBeenCalled();
  });
});
