import { AppState } from 'react-native'
import { renderHook } from 'test-utils'
import { useAppStateEffect } from './useAppStateEffect'

describe('useAppStateEffect', () => {
  const appStateSpy = jest.spyOn(AppState, 'addEventListener')

  it('should call the callback if the app transitions from active to inactive', () => {
    const callback = jest.fn()
    renderHook(() => useAppStateEffect(callback))
    const setAppState = appStateSpy.mock.calls[0][1]
    setAppState('active')
    setAppState('inactive')
    expect(callback).toHaveBeenCalledWith(false, expect.any(Number))
    const differenceInMsBetweenStateChanges = callback.mock.calls[0][1]
    expect(differenceInMsBetweenStateChanges).toBeLessThan(1000)
  })
  it('should call the callback if the app transitions from inactive to active', () => {
    const callback = jest.fn()
    renderHook(() => useAppStateEffect(callback))
    const setAppState = appStateSpy.mock.calls[0][1]
    setAppState('inactive')
    setAppState('active')
    expect(callback).toHaveBeenCalledWith(true, expect.any(Number))
    expect(callback.mock.calls[0][1]).toBeLessThan(1000)
  })

  it('should call the callback if the app transitions from background to active', () => {
    const callback = jest.fn()
    renderHook(() => useAppStateEffect(callback))
    const setAppState = appStateSpy.mock.calls[0][1]
    setAppState('background')
    setAppState('active')
    expect(callback).toHaveBeenCalledWith(true, expect.any(Number))
    expect(callback.mock.calls[0][1]).toBeLessThan(1000)
  })
})
