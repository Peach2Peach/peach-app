import { renderHook, waitFor } from "test-utils";
import { feeEstimates } from "../../../tests/unit/data/electrumData";
import { unauthorizedError } from "../../../tests/unit/data/peachAPIData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { placeholderFeeEstimates, useFeeEstimates } from "./useFeeEstimates";

jest.useFakeTimers();

jest.mock("../../utils/electrum/getFeeEstimates");
const getFeeEstimatesMock = jest
  .requireMock("../../utils/electrum/getFeeEstimates")
  .getFeeEstimates.mockResolvedValue([feeEstimates]);

describe("useFeeEstimates", () => {
  const initialProps = { txId: "txId" };

  afterEach(() => {
    queryClient.clear();
  });

  it("fetches feeEstimates from API", async () => {
    const { result } = renderHook(useFeeEstimates, { initialProps });
    expect(result.current).toEqual({
      feeEstimates: placeholderFeeEstimates,
      isFetching: true,
      error: null,
    });
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current).toEqual({
      feeEstimates,
      isFetching: false,
      error: null,
    });
  });
  it("returns error if server did not return result", async () => {
    getFeeEstimatesMock.mockResolvedValueOnce([null, unauthorizedError]);
    const { result } = renderHook(useFeeEstimates, { initialProps });
    expect(result.current).toEqual({
      feeEstimates: placeholderFeeEstimates,
      isFetching: true,
      error: null,
    });
    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(result.current).toEqual({
      feeEstimates: placeholderFeeEstimates,
      isFetching: false,
      error: new Error(unauthorizedError.error),
    });
  });
});
