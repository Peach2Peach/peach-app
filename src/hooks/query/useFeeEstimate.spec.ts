import { renderHook, waitFor } from "test-utils";
import { getError } from "../../../peach-api/src/utils/result";
import { estimatedFees } from "../../../tests/unit/data/bitcoinNetworkData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../utils/peachAPI";
import { placeholderFees, useFeeEstimate } from "./useFeeEstimate";

const getFeeEstimateMock = jest.spyOn(
  peachAPI.public.bitcoin,
  "getFeeEstimate",
);

jest.useFakeTimers();

describe("useFeeEstimate", () => {
  afterEach(() => {
    queryClient.clear();
  });

  it("fetches fee estimates from API", async () => {
    const { result } = renderHook(useFeeEstimate);
    expect(result.current).toEqual({
      estimatedFees: placeholderFees,
      isLoading: true,
      error: null,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current).toEqual({
      estimatedFees,
      isLoading: false,
      error: null,
    });
  });
  it("returns error if server did not return result", async () => {
    getFeeEstimateMock.mockResolvedValueOnce(
      getError({ error: "UNAUTHORIZED" }),
    );
    const { result } = renderHook(useFeeEstimate);
    expect(result.current).toEqual({
      estimatedFees: placeholderFees,
      isLoading: true,
      error: null,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      estimatedFees: placeholderFees,
      isLoading: false,
      error: new Error("UNAUTHORIZED"),
    });
  });
});
