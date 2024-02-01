import { act, renderHook } from "test-utils";
import { useGoToOrigin } from "./useGoToOrigin";
import { useNavigation } from "./useNavigation";

jest.mock("./useNavigation", () => ({
  useNavigation: jest.fn().mockReturnValue({
    getState: jest.fn().mockReturnValue({
      routes: [
        { name: "buyOfferPreferences" },
        { name: "sellOfferPreferences" },
        { name: "paymentDetails" },
      ],
    }),
    goBack: jest.fn(),
  }),
}));

describe("useGoToOrigin", () => {
  afterEach(() => {
    (<jest.Mock>useNavigation().goBack).mockReset();
  });
  it("goes back to origin and stops when found", () => {
    const { result } = renderHook(() => useGoToOrigin());
    act(() => {
      result.current("buyOfferPreferences");
    });

    expect(useNavigation().goBack).toHaveBeenCalledTimes(2);
  });

  it("goes back to second origin and stops when found", () => {
    const { result } = renderHook(() => useGoToOrigin());
    act(() => {
      result.current("sellOfferPreferences");
    });

    expect(useNavigation().goBack).toHaveBeenCalledTimes(1);
  });

  it("does nothing if origin not found", () => {
    const { result } = renderHook(() => useGoToOrigin());
    act(() => {
      result.current("settings");
    });

    expect(useNavigation().goBack).not.toHaveBeenCalled();
  });
});
