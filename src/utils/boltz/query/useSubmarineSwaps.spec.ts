import { renderHook, waitFor } from "test-utils";
import { getResult } from "../../../../peach-api/src/utils/result/getResult";
import { submarineSwapList } from "../../../../tests/unit/data/boltzData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { useSubmarineSwaps } from "./useSubmarineSwaps";

jest.mock("../api/getSubmarineSwaps");
jest.requireMock("../api/getSubmarineSwaps").getSubmarineSwaps.mockResolvedValue(getResult(submarineSwapList))

jest.useFakeTimers();

describe("useSubmarineSwaps", () => {
  afterEach(() => {
    queryClient.clear();
  });

  it("fetches swap status from API", async () => {
    const { result } = renderHook(useSubmarineSwaps);
    expect(result.current).toEqual({
      submarineList: undefined,
      isLoading: true,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current).toEqual({
      submarineList: submarineSwapList,
      isLoading: false,
    });
  });
});
