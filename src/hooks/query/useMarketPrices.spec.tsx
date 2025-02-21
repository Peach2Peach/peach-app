import { act, renderHook, responseUtils, waitFor } from "test-utils";
import { FIFTEEN_SECONDS } from "../../constants";
import { peachAPI } from "../../utils/peachAPI";
import { useMarketPrices } from "./useMarketPrices";

const marketPricesMock = jest.spyOn(peachAPI.public.market, "marketPrices");
jest.useFakeTimers();
describe("useMarketPrices", () => {
  it("should return marketPrices", async () => {
    const { result } = renderHook(useMarketPrices);
    expect(result.current.isLoading).toEqual(true);
    await waitFor(() => expect(result.current.isLoading).toEqual(false));
    expect(result.current.data).toEqual({
      EUR: 21000,
      CHF: 21000,
    });
  });
  it("should handle errors", async () => {
    marketPricesMock.mockResolvedValueOnce(responseUtils);
    const { result } = renderHook(useMarketPrices);
    await waitFor(() => {
      expect(result.current.error).toEqual(
        Error("Error fetching market prices"),
      );
    });
  });
  it("should refetch every 15 seconds", async () => {
    marketPricesMock
      .mockResolvedValueOnce({
        result: {
          EUR: 21000,
          CHF: 21000,
        },
        ...responseUtils,
      })
      .mockResolvedValueOnce({
        result: {
          EUR: 1000000,
          CHF: 1000000,
        },
        ...responseUtils,
      });

    const { result } = renderHook(useMarketPrices);
    await waitFor(() => {
      expect(result.current.data).toEqual({
        EUR: 21000,
        CHF: 21000,
      });
    });
    act(() => {
      jest.advanceTimersByTime(FIFTEEN_SECONDS);
    });
    await waitFor(() => {
      expect(result.current.data).toEqual({
        EUR: 1000000,
        CHF: 1000000,
      });
    });
  });
  it("should preserve the existing data on error", async () => {
    marketPricesMock
      .mockResolvedValueOnce({
        result: {
          EUR: 21000,
          CHF: 21000,
        },
        ...responseUtils,
      })
      .mockResolvedValueOnce(responseUtils);

    const { result } = renderHook(useMarketPrices);
    await waitFor(() => {
      expect(result.current.data).toEqual({
        EUR: 21000,
        CHF: 21000,
      });
    });
    act(() => {
      jest.advanceTimersByTime(FIFTEEN_SECONDS);
    });
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.data).toEqual({
        EUR: 21000,
        CHF: 21000,
      });
    });
  });
});
