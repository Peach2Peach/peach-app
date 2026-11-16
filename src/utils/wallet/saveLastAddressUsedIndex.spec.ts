import { user69DetailsKeys } from "../../hooks/query/peach069/useUser69";
import { queryClient } from "../../queryClient";
import { peachAPI } from "../peachAPI";
import { saveLastAddressUsedIndex } from "./saveLastAddressUsedIndex";

jest.mock("../peachAPI", () => ({
  peachAPI: {
    private: {
      peach069: { setLastAddressUsedIndexOnSelfUser69: jest.fn() },
    },
  },
}));
jest.mock("../log/error", () => ({ error: jest.fn() }));

const saveMock = jest.mocked(
  peachAPI.private.peach069.setLastAddressUsedIndexOnSelfUser69,
);
const cachedIndex = () =>
  queryClient.getQueryData<{ lastAddressUsedIndex?: number }>(
    user69DetailsKeys.details(),
  )?.lastAddressUsedIndex;

describe("saveLastAddressUsedIndex", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    queryClient.setQueryData(user69DetailsKeys.details(), {
      id: "user",
      offerAlertsActive: false,
      lastAddressUsedIndex: 3,
    });
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  // only past the retry delays (2s + 4s): running every timer would also fire
  // react-query's cache garbage collection and drop the cached user
  const RETRY_WINDOW_MS = 10_000;
  const run = async (index: number) => {
    const promise = saveLastAddressUsedIndex(index);
    await jest.advanceTimersByTimeAsync(RETRY_WINDOW_MS);
    return promise;
  };

  it("saves the index once when the server accepts it", async () => {
    saveMock.mockResolvedValue({ result: { success: true } } as never);
    expect(await run(4)).toBe(true);
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(saveMock).toHaveBeenCalledWith({ index: 4 });
  });

  it("saves index 0", async () => {
    queryClient.setQueryData(user69DetailsKeys.details(), {
      id: "user",
      offerAlertsActive: false,
    });
    saveMock.mockResolvedValue({ result: { success: true } } as never);
    expect(await run(0)).toBe(true);
    expect(saveMock).toHaveBeenCalledWith({ index: 0 });
    expect(cachedIndex()).toBe(0);
  });

  it("retries after an error response and a thrown request", async () => {
    saveMock
      .mockResolvedValueOnce({ error: { error: "INTERNAL" } } as never)
      .mockRejectedValueOnce(new Error("Network request failed"))
      .mockResolvedValueOnce({ result: { success: true } } as never);
    expect(await run(4)).toBe(true);
    expect(saveMock).toHaveBeenCalledTimes(3);
  });

  it("gives up without throwing and keeps the index in the cache", async () => {
    saveMock.mockRejectedValue(new Error("Network request failed"));
    expect(await run(4)).toBe(false);
    expect(saveMock).toHaveBeenCalledTimes(3);
    expect(cachedIndex()).toBe(4);
  });

  it("never lowers the cached index", async () => {
    saveMock.mockRejectedValue(new Error("Network request failed"));
    await run(1);
    expect(cachedIndex()).toBe(3);
  });
});
