import { act, renderHook } from '@testing-library/react-native'
import { AppState } from 'react-native'
import { useAppState } from './useAppState'

describe('useAppState', () => {
  const appStateSpy = jest.spyOn(AppState, 'addEventListener')
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return appState', () => {
    const { result } = renderHook(useAppState)
    expect(result.current).toBe(undefined)
  })
  it('should return appState when appState is active', () => {
    const { result } = renderHook(useAppState)
    const setAppState = appStateSpy.mock.calls[0][1]
    act(() => {
      setAppState('active')
    })
    expect(result.current).toBe('active')
  })
  it('should return appState when appState is inactive', () => {
    const { result } = renderHook(useAppState)
    const setAppState = appStateSpy.mock.calls[0][1]
    act(() => {
      setAppState('inactive')
    })
    expect(result.current).toBe('inactive')
  })
  it('should return appState when appState is background', () => {
    const { result } = renderHook(useAppState)
    const setAppState = appStateSpy.mock.calls[0][1]
    act(() => {
      setAppState('background')
    })
    expect(result.current).toBe('background')
  })
  it('should return appState when appState is unknown', () => {
    const { result } = renderHook(useAppState)
    const setAppState = appStateSpy.mock.calls[0][1]
    act(() => {
      setAppState('unknown')
    })
    expect(result.current).toBe('unknown')
  })
})
