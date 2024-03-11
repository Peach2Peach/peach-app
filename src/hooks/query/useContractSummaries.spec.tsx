import { renderHook, responseUtils, waitFor } from "test-utils";
import { contractSummary } from "../../../peach-api/src/testData/contractSummary";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../utils/peachAPI";
import { useContractSummaries } from "./useContractSummaries";

const getContractSummariesMock = jest.spyOn(
  peachAPI.private.contract,
  "getContractSummaries",
);
jest.useFakeTimers();

describe("useContractSummaries", () => {
  afterEach(() => {
    queryClient.clear();
  });
  it("fetches contract summaries from API", async () => {
    const { result } = renderHook(useContractSummaries);

    expect(result.current.contracts).toEqual([]);
    expect(result.current.isLoading).toBeTruthy();

    await waitFor(() => expect(queryClient.isFetching()).toBe(0));

    expect(result.current.contracts).toEqual([contractSummary]);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.refetch).toBeInstanceOf(Function);
    expect(result.current.error).toBeFalsy();
  });
  it("returns error if server did return error", async () => {
    getContractSummariesMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    const { result } = renderHook(useContractSummaries);

    expect(result.current.contracts).toEqual([]);
    expect(result.current.isLoading).toBeTruthy();

    await waitFor(() => expect(queryClient.isFetching()).toBe(0));

    expect(result.current.contracts).toEqual([]);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toEqual(new Error("UNAUTHORIZED"));
  });
});
