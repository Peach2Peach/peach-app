import { renderHook } from '@testing-library/react-native'
import {
  NavigationWrapper,
  goBackMock,
  replaceMock,
  setParamsMock,
} from '../../../../tests/unit/helpers/NavigationWrapper'
import { useNewBadgeSetup } from './useNewBadgeSetup'

const useRouteMock = jest.fn().mockReturnValue({
  params: {
    badges: 'fastTrader',
  },
})
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

describe('useNewBadgeSetup', () => {
  it('returns default values', () => {
    const { result } = renderHook(useNewBadgeSetup, { wrapper: NavigationWrapper })
    expect(result.current).toEqual({
      badge: 'fastTrader',
      icon: 'zapCircleInverted',
      goToProfile: expect.any(Function),
      close: expect.any(Function),
    })
  })
  it('goes to profile', () => {
    const { result } = renderHook(useNewBadgeSetup, { wrapper: NavigationWrapper })
    result.current.goToProfile()
    expect(replaceMock).toHaveBeenCalledWith('myProfile')
  })
  it('closes overlay', () => {
    const { result } = renderHook(useNewBadgeSetup, { wrapper: NavigationWrapper })
    result.current.close()
    expect(goBackMock).toHaveBeenCalled()
  })
  it('shows more new badge overlays if more badges are available', () => {
    useRouteMock.mockReturnValueOnce({
      params: { badges: 'fastTrader,superTrader' },
    })
    const { result } = renderHook(useNewBadgeSetup, { wrapper: NavigationWrapper })
    result.current.close()
    expect(setParamsMock).toHaveBeenCalledWith('newBadge', { badges: 'superTrader' })
  })
})
