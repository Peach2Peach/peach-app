import { act, renderHook, responseUtils, waitFor } from "test-utils";
import { match } from "../../../../peach-api/src/testData/match";
import { MSINASECOND } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";
import { PAGESIZE, useOfferMatches } from "./useOfferMatches";

const getMatchesMock = jest.spyOn(peachAPI.private.offer, "getMatches");

jest.useFakeTimers();

describe("useOfferMatches", () => {
  it("should return the matches for an offer", async () => {
    const { result } = renderHook(useOfferMatches, { initialProps: "offerId" });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.allMatches).toEqual([match]);
  });
  it("should not make a request if not enabled", () => {
    renderHook(() => useOfferMatches("offerId", undefined, false), {});

    expect(getMatchesMock).not.toHaveBeenCalled();
  });
  it("should not remove matches when the user gets to the next page", async () => {
    const firstPage = Array(PAGESIZE).fill(match);
    const secondPage = [match];
    getMatchesMock.mockImplementation(({ page }: { page?: number }) => {
      const offerId = "offerId";
      const totalMatches = firstPage.length + secondPage.length;
      if (page === 0) {
        return Promise.resolve({
          result: { matches: firstPage, nextPage: 1, offerId, totalMatches },
          ...responseUtils,
        });
      }
      if (page === 1) {
        return Promise.resolve({
          result: { matches: secondPage, nextPage: 2, offerId, totalMatches },
          ...responseUtils,
        });
      }
      return Promise.resolve({
        result: {
          matches: [],
          nextPage: (page || 2) + 1,
          offerId,
          totalMatches,
        },
        ...responseUtils,
      });
    });

    const { result } = renderHook(useOfferMatches, {
      initialProps: "newOfferId",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.allMatches).toEqual(firstPage);

    expect(result.current.hasNextPage).toBe(true);
    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.allMatches).toEqual([...firstPage, ...secondPage]);
    });
  });
  it("should not remove matches when the user stays on the second page for 15 seconds", async () => {
    const NUMBER_OF_SECONDS = 15;
    const firstPage = Array(PAGESIZE).fill(match);
    const secondPage = [match];

    const { result } = renderHook(useOfferMatches, {
      initialProps: "newOfferId",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.allMatches).toEqual([...firstPage, ...secondPage]);
    });

    await waitFor(() => {
      jest.advanceTimersByTime(MSINASECOND * NUMBER_OF_SECONDS);
    });

    expect(result.current.allMatches).toEqual([...firstPage, ...secondPage]);
  });

  it("should return matches for a funded sell offer", async () => {
    getMatchesMock.mockImplementation((..._args) =>
      Promise.resolve({
        result: {
          matches: [match],
          remainingMatches: 0,
          nextPage: 1,
          totalMatches: 1,
          offerId: "offerId",
        },
        ...responseUtils,
      }),
    );
    const { result } = renderHook(useOfferMatches, {
      initialProps: "thirdOfferId",
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.allMatches).toEqual([match]);
  });
  it("should apply sorting to the matches", async () => {
    const { result } = renderHook(useOfferMatches, { initialProps: "offerId" });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getMatchesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: ["bestReputation"],
      }),
    );
  });
});
