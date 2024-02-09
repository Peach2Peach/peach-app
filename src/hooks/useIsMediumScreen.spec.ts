import { renderHook } from "test-utils";
import { useIsMediumScreen } from "./useIsMediumScreen";

describe("useIsMediumScreen", () => {
  jest
    .spyOn(jest.requireActual("react-native"), "useWindowDimensions")
    .mockReturnValueOnce({ width: 375, height: 690 })
    .mockReturnValueOnce({ width: 374, height: 689 });

  it("should return true if the screen is medium", () => {
    const { result } = renderHook(useIsMediumScreen);
    expect(result.current).toBe(true);
  });
  it("should return false if the screen is not medium", () => {
    const { result } = renderHook(useIsMediumScreen);
    expect(result.current).toBe(false);
  });
});
