import { getAbortWithTimeout } from './getAbortWithTimeout'
jest.useFakeTimers()

describe('getAbortWithTimeout', () => {
  it('should return a controller', () => {
    const result = getAbortWithTimeout()
    expect(result).toBeInstanceOf(AbortController)
  })

  it('should return a controller with a signal', () => {
    const result = getAbortWithTimeout()
    expect(result.signal).toBeInstanceOf(AbortSignal)
  })

  it('should return a controller with a signal that is not aborted', () => {
    const result = getAbortWithTimeout()
    expect(result.signal.aborted).toBe(false)
  })

  it('should return a controller with a signal that is aborted when the timeout is reached', () => {
    const result = getAbortWithTimeout(1)
    jest.advanceTimersByTime(1)
    expect(result.signal.aborted).toBe(true)
  })
})
