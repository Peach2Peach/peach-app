/* eslint-disable max-lines-per-function */
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { LayoutChangeEvent } from 'react-native'
import { useConfirmSliderSetup } from './useConfirmSliderSetup'

jest.useFakeTimers()

describe('useConfirmSliderSetup', () => {
  const onConfirm = jest.fn()
  const initialProps = {
    onConfirm,
    knobWidth: 32,
  }
  const widthToSlide = 228

  it('should return default values', () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps })
    expect(result.current).toEqual({
      pan: expect.any(Object),
      panResponder: expect.any(Object),
      widthToSlide,
      onLayout: expect.any(Function),
    })
    // @ts-ignore
    expect(result.current.pan._startingValue).toEqual(0)
    // @ts-ignore
    expect(result.current.pan._offset).toEqual(0)
  })

  it('should update onLayout', () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps })
    act(() => result.current.onLayout({ nativeEvent: { layout: { width: 400 } } } as LayoutChangeEvent))
    expect(result.current.widthToSlide).toEqual(368)
  })

  it('should not update onLayout width zero dimensions', () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps })
    act(() => result.current.onLayout({ nativeEvent: { layout: { width: NaN } } } as LayoutChangeEvent))
    expect(result.current.widthToSlide).toEqual(228)
  })

  it('should call onConfirm when sliding to the end', async () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps })
    const endTouch = { currentPageX: widthToSlide, previousPageX: 0, touchActive: true, currentTimeStamp: 1 }
    const moveEvent = {
      touchHistory: {
        touchBank: [endTouch],
        numberActiveTouches: 1,
        indexOfSingleActiveTouch: 0,
        mostRecentTimeStamp: 1,
      },
    }

    // @ts-ignore
    result.current.panResponder.panHandlers.onResponderMove(moveEvent)
    // @ts-ignore
    expect(result.current.pan._value).toEqual(1)

    // @ts-ignore
    result.current.panResponder.panHandlers.onResponderRelease()
    expect(onConfirm).toHaveBeenCalled()

    // @ts-ignore
    await waitFor(() => expect(result.current.pan._offset).toEqual(0))
    await waitFor(() => jest.runAllTimers())
  })
  it('should not call onConfirm when sliding not completely to the end', async () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps })
    const endTouch = { currentPageX: widthToSlide - 1, previousPageX: 0, touchActive: true, currentTimeStamp: 1 }
    const moveEvent = {
      touchHistory: {
        touchBank: [endTouch],
        numberActiveTouches: 1,
        indexOfSingleActiveTouch: 0,
        mostRecentTimeStamp: 1,
      },
    }

    // @ts-ignore
    result.current.panResponder.panHandlers.onResponderMove(moveEvent)
    // @ts-ignore
    expect(result.current.pan._value).toEqual((widthToSlide - 1) / widthToSlide)

    // @ts-ignore
    result.current.panResponder.panHandlers.onResponderRelease()
    expect(onConfirm).not.toHaveBeenCalled()

    // @ts-ignore
    await waitFor(() => expect(result.current.pan._offset).toEqual(0))
    await waitFor(() => jest.runAllTimers())
  })
  it('should not slide when disabled', () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps: { ...initialProps, disabled: true } })
    const endTouch = { currentPageX: widthToSlide, previousPageX: 0, touchActive: true, currentTimeStamp: 1 }
    const moveEvent = {
      touchHistory: {
        touchBank: [endTouch],
        numberActiveTouches: 1,
        indexOfSingleActiveTouch: 0,
        mostRecentTimeStamp: 1,
      },
    }
    // @ts-ignore
    expect(result.current.panResponder.panHandlers?.onMoveShouldSetResponder?.(moveEvent)).toBe(false)
  })
})
