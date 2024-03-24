import { renderHook, waitFor } from "test-utils";
import { getResult } from "../../../../peach-api/src/utils/result/getResult";
import { reverseSwapList } from "../../../../tests/unit/data/boltzData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { useReverseSubmarineSwaps } from "./useReverseSubmarineSwaps";

jest.mock("../api/getReverseSubmarineSwaps");
jest
  .requireMock("../api/getReverseSubmarineSwaps")
  .getReverseSubmarineSwaps.mockResolvedValue(getResult(reverseSwapList));

jest.useFakeTimers();

describe("useReverseSubmarineSwaps", () => {
  afterEach(() => {
    queryClient.clear();
  });

  it("fetches swap list from API", async () => {
    const { result } = renderHook(useReverseSubmarineSwaps);
    expect(result.current).toEqual({
      reverseSubmarineList: undefined,
      isLoading: true,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current).toEqual({
      reverseSubmarineList: reverseSwapList,
      isLoading: false,
    });
  });
});
