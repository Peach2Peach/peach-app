import { Keyboard, LayoutChangeEvent } from 'react-native'
import { act, renderHook } from 'test-utils'
import { useSelectAmountSetup } from './useSelectAmountSetup'

describe('useSelectAmountSetup', () => {
  const min = 50000
  const max = 3000000
  const value = 600000
  const onChange = jest.fn()
  const initialProps = {
    min,
    max,
    value,
    onChange,
  }
  const dismissSpy = jest.spyOn(Keyboard, 'dismiss')

  it('should return default values', () => {
    const { result } = renderHook(useSelectAmountSetup, { initialProps })
    expect(result.current).toEqual({
      amount: 600000,
      updateCustomAmount: expect.any(Function),
      pan: expect.any(Object),
      panResponder: expect.any(Object),
      trackRange: [0, 230],
      onTrackLayout: expect.any(Function),
    })
    // @ts-ignore
    expect(result.current.pan._startingValue).toEqual(187)
    // @ts-ignore
    expect(result.current.pan._offset).toEqual(187)
  })
  it('should update amount', () => {
    const { result } = renderHook(useSelectAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmount(69420))
    expect(result.current.amount).toEqual(69420)
    // @ts-ignore
    expect(result.current.pan._offset).toEqual(228)
    expect(onChange).toHaveBeenCalledWith(69420)
  })
  it('should respect minimum when updating amount', () => {
    const { result } = renderHook(useSelectAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmount(0))
    expect(result.current.amount).toEqual(0)
    // @ts-ignore
    expect(result.current.pan._offset).toEqual(234)
  })
  it('should respect maximum when updating amount', () => {
    const { result } = renderHook(useSelectAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmount(max * 2))
    expect(result.current.amount).toEqual(max)
    expect(dismissSpy).toHaveBeenCalled()
    // @ts-ignore
    expect(result.current.pan._offset).toEqual(0)
  })
  it('should update onTrackLayout', () => {
    const { result } = renderHook(useSelectAmountSetup, { initialProps })
    act(() => result.current.onTrackLayout({ nativeEvent: { layout: { height: 400 } } } as LayoutChangeEvent))
    // @ts-ignore
    expect(result.current.pan._offset).toEqual(301)
  })
  it('should update amount when pan changes occur', () => {
    const { result } = renderHook(useSelectAmountSetup, { initialProps })
    // @ts-ignore
    act(() => result.current.pan.__callListeners(40))
    expect(result.current.amount).toEqual(2490000)
    expect(onChange).toHaveBeenCalledWith(2490000)
  })
})
