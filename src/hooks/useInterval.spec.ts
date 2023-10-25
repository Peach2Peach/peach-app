import { renderHook } from 'test-utils'
import { useInterval } from './useInterval'

jest.useFakeTimers()

describe('useInterval', () => {
  it('should call the callback at the specified interval', () => {
    const callback = jest.fn()
    const interval = 1000

    renderHook(useInterval, { initialProps: { callback, interval } })
    expect(callback).not.toHaveBeenCalled()

    jest.advanceTimersByTime(interval)
    expect(callback).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(interval)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should clear the interval on unmount', () => {
    const callback = jest.fn()
    const interval = 1000

    const { unmount } = renderHook(useInterval, { initialProps: { callback, interval } })

    unmount()

    jest.advanceTimersByTime(interval)
    expect(callback).not.toHaveBeenCalled()
  })

  it('should not set up an interval if interval is null', () => {
    const callback = jest.fn()

    renderHook(useInterval, { initialProps: { callback, interval: null } })
    expect(callback).not.toHaveBeenCalled()
  })
})
