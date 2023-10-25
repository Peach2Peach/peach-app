import { Keyboard, LayoutChangeEvent } from 'react-native'
import { act, renderHook } from 'test-utils'
import { useRangeAmountSetup } from './useRangeAmountSetup'

// eslint-disable-next-line max-lines-per-function
describe('useRangeAmountSetup', () => {
  const min = 50000
  const max = 3000000
  const value: [number, number] = [100000, 600000]
  const onChange = jest.fn()
  const initialProps = {
    min,
    max,
    value,
    onChange,
  }
  const dismissSpy = jest.spyOn(Keyboard, 'dismiss')

  it('should return default values', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    expect(result.current).toEqual({
      minimum: value[0],
      maximum: value[1],
      updateCustomAmountMaximum: expect.any(Function),
      updateCustomAmountMinimum: expect.any(Function),
      minY: 226,
      maxY: 187,
      panMin: expect.any(Object),
      panMax: expect.any(Object),
      panMinResponder: expect.any(Object),
      panMaxResponder: expect.any(Object),
      trackRangeMin: [30, 230],
      trackRangeMax: [0, 200],
      onTrackLayout: expect.any(Function),
      knobHeight: 30,
    })
    // @ts-ignore
    expect(result.current.panMin._startingValue).toEqual(226)
    // @ts-ignore
    expect(result.current.panMin._offset).toEqual(226)
    // @ts-ignore
    expect(result.current.panMax._startingValue).toEqual(187)
    // @ts-ignore
    expect(result.current.panMax._offset).toEqual(187)
  })
  it('should update minimum amount', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmountMinimum(69420))
    expect(result.current.minimum).toEqual(69420)
    // @ts-ignore
    expect(result.current.panMin._offset).toEqual(228)
    expect(onChange).toHaveBeenCalledWith([69420, value[1]])
  })
  it('should update maximum amount', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmountMaximum(69420))
    expect(result.current.maximum).toEqual(69420)
    // @ts-ignore
    expect(result.current.panMax._offset).toEqual(228)
    expect(onChange).toHaveBeenCalledWith([50000, 69420])
  })
  it('should update maximum amount when minimum goes above maximum', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmountMaximum(100000))
    act(() => result.current.updateCustomAmountMinimum(200000))
    expect(result.current.minimum).toEqual(200000)
    expect(result.current.maximum).toEqual(580000)
    // @ts-ignore
    expect(result.current.panMin._offset).toEqual(218)
    // @ts-ignore
    expect(result.current.panMax._offset).toEqual(189)
  })
  it('should update minimum amount when maximum goes below minimum', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmountMinimum(2000000))
    act(() => result.current.updateCustomAmountMaximum(1000000))
    expect(result.current.minimum).toEqual(620000)
    expect(result.current.maximum).toEqual(1000000)
    // @ts-ignore
    expect(result.current.panMin._offset).toEqual(186)
    // @ts-ignore
    expect(result.current.panMax._offset).toEqual(156)
  })
  it('should respect minimum when updating minumum amount', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmountMinimum(0))
    expect(result.current.minimum).toEqual(0)
    // @ts-ignore
    expect(result.current.panMin._offset).toEqual(234)
  })
  it('should respect maximum when updating maximum amount', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmountMaximum(max * 2))
    expect(result.current.maximum).toEqual(max)
    expect(dismissSpy).toHaveBeenCalled()
    // @ts-ignore
    expect(result.current.panMin._offset).toEqual(226)
  })
  it('should respect maximum when updating minimum amount', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmountMinimum(max * 2))
    expect(result.current.minimum).toEqual(max)
    expect(dismissSpy).toHaveBeenCalled()
    // @ts-ignore
    expect(result.current.panMin._offset).toEqual(0)
  })
  it('should respect minimum when updating maximum amount', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    act(() => result.current.updateCustomAmountMaximum(0))
    expect(result.current.maximum).toEqual(0)
    // @ts-ignore
    expect(result.current.panMax._offset).toEqual(234)
  })
  it('should update onTrackLayout', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    act(() => result.current.onTrackLayout({ nativeEvent: { layout: { height: 400 } } } as LayoutChangeEvent))
    // @ts-ignore
    expect(result.current.panMin._offset).toEqual(364)
    // @ts-ignore
    expect(result.current.panMax._offset).toEqual(301)
  })
  it('should update amount when min pan changes occur', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    // @ts-ignore
    act(() => result.current.panMin.__callListeners(40))
    expect(result.current.minimum).toEqual(2490000)
    expect(onChange).toHaveBeenCalledWith([2490000, 2870000])
  })
  it('should update amount when max pan changes occur', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    // @ts-ignore
    act(() => result.current.panMax.__callListeners(40))
    expect(result.current.maximum).toEqual(2490000)
    expect(onChange).toHaveBeenCalledWith([value[0], 2490000])
  })
  it('should push max amount amount when min pan goes above max', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    expect(result.current.maximum).toEqual(600000)

    // @ts-ignore
    act(() => result.current.panMax.__callListeners(100))
    // @ts-ignore
    act(() => result.current.panMin.__callListeners(80))
    expect(result.current.minimum).toEqual(1970000)
    expect(result.current.maximum).toEqual(2350000)
  })
  it('should push min amount amount when max pan goes below min pan', () => {
    const { result } = renderHook(useRangeAmountSetup, { initialProps })
    expect(result.current.minimum).toEqual(100000)

    // @ts-ignore
    act(() => result.current.panMin.__callListeners(80))
    // @ts-ignore
    act(() => result.current.panMax.__callListeners(100))
    expect(result.current.minimum).toEqual(1340000)
    expect(result.current.maximum).toEqual(1720000)
  })
})
