import { renderHook } from '@testing-library/react-hooks'
import { useDebounce } from './useDebounce'

jest.useFakeTimers()

describe('useDebounce', () => {
  const value = 'A'

  it('should not immediately run debounced function', () => {
    const callback = jest.fn()
    renderHook(() => useDebounce(value, callback, 1000))
    expect(callback).not.toHaveBeenCalled()
  })
  it('should run debounced function delay passes and dependency not change', () => {
    const callback = jest.fn()
    renderHook(() => useDebounce(value, callback, 1000))
    jest.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalled()
  })
  it('should reschedule delay if passed arguments update', () => {
    const newValue = 'B'
    const callback = jest.fn()
    const newCallback = jest.fn()
    const hook = renderHook(([val, cb, delay]: [any, Function, number]) => useDebounce(val, cb, delay), {
      initialProps: [value, callback, 1000],
    })
    jest.advanceTimersByTime(500)
    hook.rerender([newValue, newCallback, 1000])
    jest.advanceTimersByTime(500)
    expect(callback).not.toHaveBeenCalled()

    jest.advanceTimersByTime(500)
    expect(callback).not.toHaveBeenCalled()
    expect(newCallback).toHaveBeenCalled()
  })
  it('should not reschedule delay if passed arguments stay the same', () => {
    const callback = jest.fn()
    const hook = renderHook(([val, cb, delay]: [any, Function, number]) => useDebounce(val, cb, delay), {
      initialProps: [value, callback, 1000],
    })
    jest.advanceTimersByTime(500)
    hook.rerender([value, callback, 1000])
    jest.advanceTimersByTime(500)
    expect(callback).toHaveBeenCalled()
  })
})
