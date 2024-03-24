import { act, renderHook, waitFor } from "test-utils";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "../../../utils/wallet/PeachLiquidJSWallet";
import {
  peachLiquidWallet,
  setLiquidWallet,
} from "../../../utils/wallet/setWallet";
import { useSyncLiquidWallet } from "./useSyncLiquidWallet";
import { walletKeys } from "./useUTXOs";

const mockShowErrorBanner = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));
const mockSyncWallet = jest.fn().mockResolvedValue(undefined);
jest.useFakeTimers();

describe("useSyncLiquidWallet", () => {
  beforeAll(() => {
    setLiquidWallet(new PeachLiquidJSWallet({ wallet: createTestWallet() }));
    if (!peachLiquidWallet) throw new Error("PeachWallet not set");
    peachLiquidWallet.syncWallet = mockSyncWallet;
  });
  afterEach(() => {
    queryClient.clear();
  });
  it("should sync the wallet on mount", async () => {
    renderHook(() => useSyncLiquidWallet({ enabled: true }));
    await waitFor(() => {
      expect(mockSyncWallet).toHaveBeenCalled();
    });
  });
  it("should set refreshing to true on refresh", async () => {
    const { result } = renderHook(() => useSyncLiquidWallet({ enabled: true }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(queryClient.isFetching()).toBe(0);
    act(() => {
      result.current.refetch();
    });
    expect(queryClient.isFetching()).toBe(1);
    expect(
      queryClient.getQueryState(walletKeys.synced("liquid"))?.fetchStatus,
    ).toBe("fetching");

    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
  });
  it("should call peachLiquidWallet.syncWallet on refresh", async () => {
    const { result } = renderHook(() => useSyncLiquidWallet({ enabled: true }));
    await waitFor(() => expect(mockSyncWallet).toHaveBeenCalled());

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockSyncWallet).toHaveBeenCalledTimes(2);
  });
  it("should not call peachLiquidWallet.syncWallet if already syncing", async () => {
    const { result } = renderHook(() => useSyncLiquidWallet({ enabled: true }));

    act(() => {
      result.current.refetch();
      result.current.refetch();
    });
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(mockSyncWallet).toHaveBeenCalledTimes(1);
  });
  it("should not call peachLiquidWallet.syncWallet by default", async () => {
    const { result } = renderHook(useSyncLiquidWallet);

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(mockSyncWallet).toHaveBeenCalledTimes(0);
  });
  it("should handle wallet sync errors", async () => {
    mockSyncWallet.mockImplementation(() => {
      throw new Error("error");
    });
    renderHook(() => useSyncLiquidWallet({ enabled: true }));

    await waitFor(() => {
      expect(mockShowErrorBanner).toHaveBeenCalledWith("WALLET_SYNC_ERROR");
    });
  });
});
