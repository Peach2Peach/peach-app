import { act, renderHook, responseUtils, waitFor } from "test-utils";
import { defaultUser } from "../../../../peach-api/src/testData/userData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../../utils/peachAPI";
import { useNetworkFeesSetup } from "./useNetworkFeesSetup";

jest.useFakeTimers();

const mockUpdateUser = jest.fn().mockResolvedValue([{ success: true }]);
jest.mock("../../../utils/peachAPI/useUpdateUser", () => ({
  useUpdateUser: () => ({ mutate: mockUpdateUser }),
}));

const getSelfUserMock = jest
  .spyOn(peachAPI.private.user, "getSelfUser")
  .mockResolvedValue({
    result: { ...defaultUser, feeRate: "halfHourFee" },
    ...responseUtils,
  });

describe("useNetworkFeesSetup", () => {
  const initialProps = { network: "bitcoin" } as const;
  afterEach(() => {
    queryClient.clear();
  });
  it("returns default correct values", async () => {
    const { result } = renderHook(useNetworkFeesSetup, { initialProps });

    await waitFor(() => {
      expect(result.current).toEqual({
        selectedFeeRate: "halfHourFee",
        setSelectedFeeRate: expect.any(Function),
        customFeeRate: "",
        setCustomFeeRate: expect.any(Function),
        submit: expect.any(Function),
        isValid: true,
        feeRateSet: true,
      });
    });
  });
  it("sets custom fee rate if custom had been selected before", async () => {
    getSelfUserMock.mockResolvedValueOnce({
      result: { ...defaultUser, feeRate: 3 },
      ...responseUtils,
    });
    const { result } = renderHook(useNetworkFeesSetup, { initialProps });

    await waitFor(() => {
      expect(result.current.selectedFeeRate).toBe("custom");
      expect(result.current.customFeeRate).toBe("3");
      expect(result.current.isValid).toBeTruthy();
      expect(result.current.feeRateSet).toBeTruthy();
    });
  });
  it("handles invalid fee selection", () => {
    const { result } = renderHook(useNetworkFeesSetup, { initialProps });

    act(() => {
      result.current.setSelectedFeeRate("custom");
      result.current.setCustomFeeRate("0");
    });
    expect(result.current.customFeeRate).toBe("");
    expect(result.current.isValid).toBeFalsy();
    act(() => {
      result.current.setCustomFeeRate("abc");
    });
    expect(result.current.customFeeRate).toBe("");
    expect(result.current.isValid).toBeFalsy();
  });
  it("returns info whether a new fee rate has been set", async () => {
    const { result } = renderHook(useNetworkFeesSetup, { initialProps });
    await waitFor(() => {
      expect(result.current.feeRateSet).toBeTruthy();
    });
    act(() => {
      result.current.setSelectedFeeRate("fastestFee");
    });
    expect(result.current.feeRateSet).toBeFalsy();
  });
  it("sets fee preferences", () => {
    const { result } = renderHook(useNetworkFeesSetup, { initialProps });
    act(() => {
      result.current.setSelectedFeeRate("fastestFee");
    });
    expect(result.current.selectedFeeRate).toBe("fastestFee");
  });
  it("submits fee preferences", async () => {
    const { result } = renderHook(useNetworkFeesSetup, { initialProps });
    await act(result.current.submit);

    expect(mockUpdateUser).toHaveBeenCalledWith(
      {
        feeRate: "halfHourFee",
      },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      },
    );

    act(() => {
      result.current.setSelectedFeeRate("fastestFee");
    });
    await act(result.current.submit);

    expect(mockUpdateUser).toHaveBeenCalledWith(
      {
        feeRate: "fastestFee",
      },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      },
    );
  });
  it("submits custom fee preferences", async () => {
    const { result } = renderHook(useNetworkFeesSetup, { initialProps });

    act(() => {
      result.current.setSelectedFeeRate("custom");
      result.current.setCustomFeeRate("4");
    });
    await act(result.current.submit);
    expect(mockUpdateUser).toHaveBeenCalledWith(
      {
        feeRate: 4,
      },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      },
    );
  });
  it("submits liquid fee preferences", async () => {
    const { result } = renderHook(useNetworkFeesSetup, {
      initialProps: { network: "liquid" },
    });
    await act(result.current.submit);

    expect(mockUpdateUser).toHaveBeenCalledWith(
      {
        feeRateLiquid: "halfHourFee",
      },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      },
    );

    act(() => {
      result.current.setSelectedFeeRate("fastestFee");
    });
    await act(result.current.submit);

    expect(mockUpdateUser).toHaveBeenCalledWith(
      {
        feeRateLiquid: "fastestFee",
      },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      },
    );
  });
});
