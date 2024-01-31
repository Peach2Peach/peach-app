/* eslint-disable max-lines-per-function */
import {
  Animated,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeTouchEvent,
} from "react-native";
import { act, renderHook, waitFor } from "test-utils";
import { defaultWidth, useConfirmSliderSetup } from "./useConfirmSliderSetup";

jest.useFakeTimers();
jest.mock("../../../../hooks/useIsMediumScreen", () => ({
  useIsMediumScreen: jest.fn(() => false),
}));

describe("useConfirmSliderSetup", () => {
  const onConfirm = jest.fn();
  const initialProps = {
    onConfirm,
    enabled: true,
  };
  const knobWidth = 46;
  const widthToSlide = defaultWidth - knobWidth;

  it("should return default values", () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps });
    expect(result.current).toEqual({
      pan: new Animated.Value(0),
      panResponder: expect.any(Object),
      widthToSlide,
      onLayout: expect.any(Function),
    });
  });

  it("should update onLayout", () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps });
    const width = 400;
    act(() =>
      result.current.onLayout({
        nativeEvent: { layout: { width } },
      } as LayoutChangeEvent),
    );
    expect(result.current.widthToSlide).toEqual(width - knobWidth);
  });

  it("should not update onLayout width zero dimensions", () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps });
    act(() =>
      result.current.onLayout({
        nativeEvent: { layout: { width: NaN } },
      } as LayoutChangeEvent),
    );
    expect(result.current.widthToSlide).toEqual(widthToSlide);
  });

  it("should call onConfirm when sliding to the end", async () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps });
    const endTouch = {
      currentPageX: widthToSlide,
      previousPageX: 0,
      touchActive: true,
      currentTimeStamp: 1,
    };
    const moveEvent = {
      touchHistory: {
        touchBank: [endTouch],
        numberActiveTouches: 1,
        indexOfSingleActiveTouch: 0,
        mostRecentTimeStamp: 1,
      },
    } as unknown as NativeSyntheticEvent<NativeTouchEvent>;

    result.current.panResponder.panHandlers.onResponderMove?.(moveEvent);
    result.current.pan.addListener(({ value }) => {
      expect(value).toEqual(1);
    });

    result.current.panResponder.panHandlers.onResponderRelease?.(moveEvent);
    expect(onConfirm).toHaveBeenCalled();

    await waitFor(jest.runAllTimers);
  });
  it("should not call onConfirm when sliding not completely to the end", async () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps });
    const endTouch = {
      currentPageX: widthToSlide - 1,
      previousPageX: 0,
      touchActive: true,
      currentTimeStamp: 1,
    };
    const moveEvent = {
      touchHistory: {
        touchBank: [endTouch],
        numberActiveTouches: 1,
        indexOfSingleActiveTouch: 0,
        mostRecentTimeStamp: 1,
      },
    } as unknown as NativeSyntheticEvent<NativeTouchEvent>;

    result.current.panResponder.panHandlers.onResponderMove?.(moveEvent);
    result.current.pan.addListener(({ value }) => {
      expect(value).toEqual((widthToSlide - 1) / widthToSlide);
    });

    result.current.panResponder.panHandlers.onResponderRelease?.(moveEvent);
    expect(onConfirm).not.toHaveBeenCalled();

    await waitFor(jest.runAllTimers);
  });
  it("should not slide when disabled", async () => {
    const { result } = renderHook(useConfirmSliderSetup, {
      initialProps: { ...initialProps, enabled: false },
    });
    const endTouch = {
      currentPageX: widthToSlide,
      previousPageX: 0,
      touchActive: true,
      currentTimeStamp: 1,
    };
    const moveEvent = {
      touchHistory: {
        touchBank: [endTouch],
        numberActiveTouches: 1,
        indexOfSingleActiveTouch: 0,
        mostRecentTimeStamp: 1,
      },
    } as unknown as NativeSyntheticEvent<NativeTouchEvent>;

    result.current.panResponder.panHandlers.onResponderMove?.(moveEvent);
    result.current.pan.addListener(({ value }) => {
      expect(value).toEqual(0);
    });

    result.current.panResponder.panHandlers.onResponderRelease?.(moveEvent);
    expect(onConfirm).not.toHaveBeenCalled();

    await waitFor(jest.runAllTimers);
  });

  it("should not set the panResponder to be the responder when disabled", () => {
    const { result } = renderHook(useConfirmSliderSetup, {
      initialProps: { ...initialProps, enabled: false },
    });
    const endTouch = {
      currentPageX: widthToSlide,
      previousPageX: 0,
      touchActive: true,
      currentTimeStamp: 1,
    };
    const moveEvent = {
      touchHistory: {
        touchBank: [endTouch],
        numberActiveTouches: 1,
        indexOfSingleActiveTouch: 0,
        mostRecentTimeStamp: 1,
      },
    } as unknown as NativeSyntheticEvent<NativeTouchEvent>;
    expect(
      result.current.panResponder.panHandlers.onMoveShouldSetResponder?.(
        moveEvent,
      ),
    ).toEqual(false);
  });
});
