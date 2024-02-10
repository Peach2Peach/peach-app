import { act, renderHook } from "test-utils";
import {
  getStateMock,
  goBackMock,
} from "../../tests/unit/helpers/NavigationWrapper";
import { useGoToOrigin } from "./useGoToOrigin";

describe("useGoToOrigin", () => {
  getStateMock.mockReturnValue({
    routes: [
      { name: "buyOfferPreferences", key: "buyOfferPreferences" },
      { name: "sellOfferPreferences", key: "sellOfferPreferences" },
      { name: "offer", key: "offer" },
    ],
    index: 2,
    key: "key",
    routeNames: ["buyOfferPreferences", "sellOfferPreferences", "offer"],
    type: "stack",
    stale: false,
  });
  it("goes back to origin and stops when found", () => {
    const { result } = renderHook(useGoToOrigin);
    act(() => {
      result.current("buyOfferPreferences");
    });

    expect(goBackMock).toHaveBeenCalledTimes(2);
  });

  it("goes back to second origin and stops when found", () => {
    const { result } = renderHook(useGoToOrigin);
    act(() => {
      result.current("sellOfferPreferences");
    });

    expect(goBackMock).toHaveBeenCalledTimes(1);
  });

  it("does nothing if origin not found", () => {
    const { result } = renderHook(useGoToOrigin);
    act(() => {
      result.current("settings");
    });

    expect(goBackMock).not.toHaveBeenCalled();
  });
});
