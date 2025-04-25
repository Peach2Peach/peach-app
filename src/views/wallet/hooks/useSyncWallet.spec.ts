import { act, renderHook, waitFor } from "test-utils";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../../utils/wallet/setWallet";
import { useSyncWallet } from "./useSyncWallet";
import { walletKeys } from "./useUTXOs";

const mockShowErrorBanner = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));
const mockSyncWallet = jest.fn().mockResolvedValue(undefined);
jest.useFakeTimers();

describe("useSyncWallet", () => {
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.initialized = true;
    peachWallet.syncWallet = mockSyncWallet;
  });
  afterEach(() => {
    queryClient.clear();
  });
  it("should sync the wallet on mount", async () => {
    renderHook(() => useSyncWallet({ enabled: true }));
    await waitFor(() => {
      expect(mockSyncWallet).toHaveBeenCalled();
    });
  });
  it("should set refreshing to true on refresh", async () => {
    const { result } = renderHook(() => useSyncWallet({ enabled: true }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(queryClient.isFetching()).toBe(0);

    const refetchPromise = result.current.refetch();

    expect(queryClient.isFetching()).toBe(1);
    expect(queryClient.getQueryState(walletKeys.synced())?.fetchStatus).toBe(
      "fetching",
    );

    await refetchPromise;

    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
  });
  it("should call peachWallet.syncWallet on refresh", async () => {
    const { result } = renderHook(() => useSyncWallet({ enabled: true }));
    await waitFor(() => expect(mockSyncWallet).toHaveBeenCalled());

    await act(() => result.current.refetch());

    expect(mockSyncWallet).toHaveBeenCalledTimes(2);
  });
  it("should not call peachWallet.syncWallet if already syncing", async () => {
    const { result } = renderHook(() => useSyncWallet({ enabled: true }));

    void result.current.refetch();
    void result.current.refetch();
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    expect(mockSyncWallet).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(mockSyncWallet).not.toHaveBeenCalledTimes(2);
    });
  });
  it("should not call peachWallet.syncWallet by default", async () => {
    const { result } = renderHook(useSyncWallet);

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(mockSyncWallet).toHaveBeenCalledTimes(0);
  });
});
