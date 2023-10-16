/* eslint-disable max-lines-per-function */
import { LayoutChangeEvent } from 'react-native'
import { act, renderHook, waitFor } from 'test-utils'
import { useConfirmSliderSetup } from './useConfirmSliderSetup'

jest.useFakeTimers()
jest.mock('../../../../hooks/useIsMediumScreen', () => ({
  useIsMediumScreen: jest.fn(() => false),
}))

describe('useConfirmSliderSetup', () => {
  const onConfirm = jest.fn()
  const initialProps = {
    onConfirm,
    enabled: true,
  }
  const knobWidth = 46
  const widthToSlide = 260 - knobWidth

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
    expect(result.current.widthToSlide).toEqual(400 - knobWidth)
  })

  it('should not update onLayout width zero dimensions', () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps })
    act(() => result.current.onLayout({ nativeEvent: { layout: { width: NaN } } } as LayoutChangeEvent))
    expect(result.current.widthToSlide).toEqual(widthToSlide)
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
  it('should not slide when disabled', async () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps: { ...initialProps, enabled: false } })
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
    expect(result.current.pan._offset).toEqual(0)

    // @ts-ignore
    result.current.panResponder.panHandlers.onResponderRelease()
    expect(onConfirm).not.toHaveBeenCalled()

    // @ts-ignore
    await waitFor(() => expect(result.current.pan._offset).toEqual(0))
    await waitFor(() => jest.runAllTimers())
  })

  it('should not set the panResponder to be the responder when disabled', () => {
    const { result } = renderHook(useConfirmSliderSetup, { initialProps: { ...initialProps, enabled: false } })
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
    expect(result.current.panResponder.panHandlers.onMoveShouldSetResponder(moveEvent)).toEqual(false)
  })
})
