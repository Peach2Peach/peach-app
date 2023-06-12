import { Animated } from 'react-native'
import { panListener } from './panListener'

describe('panListener', () => {
  it('should add a listener to the pan value', () => {
    const pan = new Animated.Value(0)
    const range = [0, 100] satisfies [number, number]
    const trackRange = [0, 100] satisfies [number, number]
    const setValue = jest.fn()
    const restrictRange = trackRange
    panListener(pan, range, trackRange, setValue, restrictRange)

    expect(pan.hasListeners()).toBe(true)
  })
  it('should remove all listeners from the pan value', () => {
    const pan = new Animated.Value(0)
    const range = [0, 100] satisfies [number, number]
    const trackRange = [0, 100] satisfies [number, number]
    const setValue = jest.fn()
    const restrictRange = trackRange
    const removeListener = panListener(pan, range, trackRange, setValue, restrictRange)

    removeListener()
    expect(pan.hasListeners()).toBe(false)
  })
  it('should call setValue with the interpolated value', () => {
    const pan = new Animated.Value(0)
    const range = [0, 100] satisfies [number, number]
    const trackRange = [0, 100] satisfies [number, number]
    const setValue = jest.fn()
    const restrictRange = trackRange
    panListener(pan, range, trackRange, setValue, restrictRange)

    pan.setValue(50)
    expect(setValue).toHaveBeenCalledWith(50, 50)
  })
  it('should restrict the value to the restrictRange', () => {
    const pan = new Animated.Value(0)
    const range = [0, 100] satisfies [number, number]
    const trackRange = [0, 100] satisfies [number, number]
    const setValue = jest.fn()
    const restrictRange = [0, 50] satisfies [number, number]
    panListener(pan, range, trackRange, setValue, restrictRange)

    pan.setValue(100)
    expect(setValue).toHaveBeenCalledWith(50, 50)

    pan.setValue(-100)
    expect(setValue).toHaveBeenCalledWith(0, 0)
  })
  it('should restrict the value to the trackRange if no restrictRange is provided', () => {
    const pan = new Animated.Value(0)
    const range = [0, 100] satisfies [number, number]
    const trackRange = [0, 50] satisfies [number, number]
    const setValue = jest.fn()
    panListener(pan, range, trackRange, setValue)

    pan.setValue(100)
    expect(setValue).toHaveBeenCalledWith(100, 50)

    pan.setValue(-100)
    expect(setValue).toHaveBeenCalledWith(0, 0)
  })
})
