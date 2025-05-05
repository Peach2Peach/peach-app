import { act, renderHook, waitFor } from "test-utils";
import { getResult } from "../../../peach-api/src/utils/result";
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
    marketPricesMock.mockResolvedValueOnce(getResult());
    const { result } = renderHook(useMarketPrices);
    await waitFor(() => {
      expect(result.current.error).toEqual(
        Error("Error fetching market prices"),
      );
    });
  });
  it("should refetch every 15 seconds", async () => {
    marketPricesMock
      .mockResolvedValueOnce(getResult({ EUR: 21000, CHF: 21000 }))
      .mockResolvedValueOnce(getResult({ EUR: 1000000, CHF: 1000000 }));

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
      .mockResolvedValueOnce(getResult({ EUR: 21000, CHF: 21000 }))
      .mockResolvedValueOnce(getResult());

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
