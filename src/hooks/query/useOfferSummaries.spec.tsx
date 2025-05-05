import { renderHook, waitFor } from "test-utils";
import { getError } from "../../../peach-api/src/utils/result";
import { buyOfferSummary } from "../../../tests/unit/data/offerSummaryData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../utils/peachAPI";
import { useOfferSummaries } from "./useOfferSummaries";

const getOfferSummariesMock = jest.spyOn(
  peachAPI.private.offer,
  "getOfferSummaries",
);
jest.useFakeTimers();

describe("useOfferSummaries", () => {
  afterEach(() => {
    queryClient.clear();
  });
  it("fetches offer summaries from API", async () => {
    const { result } = renderHook(useOfferSummaries);

    expect(result.current.offers).toEqual([]);
    expect(result.current.isLoading).toBeTruthy();

    await waitFor(() => expect(queryClient.isFetching()).toBe(0));

    expect(result.current.offers).toEqual([buyOfferSummary]);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.refetch).toBeInstanceOf(Function);
    expect(result.current.error).toBeFalsy();
  });
  it("returns error if server did return error", async () => {
    getOfferSummariesMock.mockResolvedValueOnce(
      getError({ error: "UNAUTHORIZED" }),
    );
    const { result } = renderHook(useOfferSummaries);

    expect(result.current.offers).toEqual([]);
    expect(result.current.isLoading).toBeTruthy();

    await waitFor(() => expect(queryClient.isFetching()).toBe(0));

    expect(result.current.offers).toEqual([]);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toEqual(new Error("UNAUTHORIZED"));
  });
});
