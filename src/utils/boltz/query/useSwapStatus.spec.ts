import { renderHook, waitFor } from "test-utils";
import { getResult } from "../../../../peach-api/src/utils/result/getResult";
import { swapStatusCreated } from "../../../../tests/unit/data/boltzData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { useSwapStatus } from "./useSwapStatus";

const getSwapStatusMock = jest
  .fn()
  .mockResolvedValue(getResult(swapStatusCreated));
jest.mock("../api/getSwapStatus", () => ({
  getSwapStatus: (...args: unknown[]) => getSwapStatusMock(...args),
}));

jest.useFakeTimers();

describe("useSwapStatus", () => {
  afterEach(() => {
    queryClient.clear();
  });

  it("fetches swap status from API", async () => {
    const { result } = renderHook(useSwapStatus, {
      initialProps: { id: "id" },
    });
    expect(result.current).toEqual({
      status: undefined,
      isLoading: true,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current).toEqual({
      status: swapStatusCreated,
      isLoading: false,
    });
  });
});
