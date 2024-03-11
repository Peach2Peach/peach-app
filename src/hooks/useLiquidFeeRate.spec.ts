import { act, renderHook, responseUtils, waitFor } from "test-utils";
import { defaultUser } from "../../peach-api/src/testData/userData";
import { estimatedFees } from "../../tests/unit/data/bitcoinNetworkData";
import { queryClient } from "../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../utils/peachAPI";
import { useLiquidFeeRate } from "./useLiquidFeeRate";

jest.mock("./query/useLiquidFeeEstimate");
jest
  .requireMock("./query/useLiquidFeeEstimate")
  .useLiquidFeeEstimate.mockReturnValue({ estimatedFees });

const getUserMock = jest.spyOn(peachAPI.private.user, "getSelfUser");
jest.useFakeTimers();

describe("useLiquidFeeRate", () => {
  it("should return custom fee rate if set", async () => {
    const customFeeRate = 123;
    getUserMock.mockResolvedValueOnce({
      result: { ...defaultUser, feeRateLiquid: customFeeRate },
      ...responseUtils,
    });
    const { result } = renderHook(useLiquidFeeRate);

    await waitFor(() => {
      expect(result.current).toEqual(customFeeRate);
    });
  });
  it("should return estimated fees", async () => {
    getUserMock.mockResolvedValueOnce({
      result: { ...defaultUser, feeRateLiquid: "fastestFee" },
      ...responseUtils,
    });
    const { result } = renderHook(useLiquidFeeRate);
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.fastestFee);
    });

    getUserMock.mockResolvedValueOnce({
      result: { ...defaultUser, feeRateLiquid: "halfHourFee" },
      ...responseUtils,
    });
    act(() => {
      queryClient.invalidateQueries({ queryKey: ["user", "self"] });
    });
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.halfHourFee);
    });

    getUserMock.mockResolvedValueOnce({
      result: { ...defaultUser, feeRateLiquid: "hourFee" },
      ...responseUtils,
    });
    act(() => {
      queryClient.invalidateQueries({ queryKey: ["user", "self"] });
    });
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.hourFee);
    });
  });
  it("should return half hour fee as fallback", async () => {
    getUserMock.mockResolvedValueOnce({
      // @ts-expect-error testing unknown fee rate
      result: { ...defaultUser, feeRateLiquid: "unknown" },
      ...responseUtils,
    });
    const { result } = renderHook(useLiquidFeeRate);
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.halfHourFee);
    });

    getUserMock.mockResolvedValueOnce({
      result: { ...defaultUser, feeRateLiquid: 0 },
      ...responseUtils,
    });
    act(() => {
      queryClient.invalidateQueries({ queryKey: ["user", "self"] });
    });
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.halfHourFee);
    });

    getUserMock.mockResolvedValueOnce({
      // @ts-expect-error testing undefined fee rate
      result: { ...defaultUser, feeRateLiquid: undefined },
      ...responseUtils,
    });
    act(() => {
      queryClient.invalidateQueries({ queryKey: ["user", "self"] });
    });
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.halfHourFee);
    });
  });
});
