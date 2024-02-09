import { renderHook, waitFor } from "test-utils";
import { feeEstimates } from "../../../tests/unit/data/electrumData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { placeholderFeeEstimates, useFeeEstimates } from "./useFeeEstimates";

jest.useFakeTimers();

global.fetch = jest.fn().mockResolvedValue({
  text: jest.fn().mockResolvedValue(JSON.stringify(feeEstimates)),
  status: 200,
});

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
    global.fetch = jest.fn().mockResolvedValue({
      status: 500,
    });
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
      error: new Error("INTERNAL_SERVER_ERROR"),
    });
  });
});
