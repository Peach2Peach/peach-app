import { LayoutChangeEvent } from "react-native";
import { act, renderHook } from "test-utils";
import {
  DEFAULT_WIDTH,
  KNOBWIDTH,
  usePremiumSliderSetup,
} from "./usePremiumSliderSetup";

describe("usePremiumSliderSetup", () => {
  const defaultPremium = 1.5;
  it("should default values", () => {
    const { result } = renderHook(() =>
      usePremiumSliderSetup(defaultPremium, jest.fn()),
    );
    expect(result.current).toEqual({
      knobWidth: 32,
      trackWidth: 260,
      max: 21,
      min: -21,
      onLayout: expect.any(Function),
      panResponder: expect.any(Object),
      pan: expect.any(Object),
    });
  });
  it("should update onTrackLayout", () => {
    const { result } = renderHook(() =>
      usePremiumSliderSetup(defaultPremium, jest.fn()),
    );
    const width = 400;
    act(() =>
      result.current.onLayout({
        nativeEvent: { layout: { width } },
      } as LayoutChangeEvent),
    );
    expect(result.current.trackWidth).toEqual(width - KNOBWIDTH);
  });
  it("should ignore layout events with no dimensions", () => {
    const { result } = renderHook(() =>
      usePremiumSliderSetup(defaultPremium, jest.fn()),
    );
    act(() =>
      result.current.onLayout({
        nativeEvent: { layout: { width: NaN } },
      } as LayoutChangeEvent),
    );
    expect(result.current.trackWidth).toEqual(DEFAULT_WIDTH);
  });
});
