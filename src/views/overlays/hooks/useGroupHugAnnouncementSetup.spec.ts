import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, goBackMock, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useGroupHugAnnouncementSetup } from './useGroupHugAnnouncementSetup'

describe('useGroupHugAnnouncementSetup', () => {
  it('returns default values', () => {
    const { result } = renderHook(useGroupHugAnnouncementSetup, { wrapper: NavigationWrapper })
    expect(result.current).toEqual({
      goToSettings: expect.any(Function),
      close: expect.any(Function),
    })
  })
  it('goes to profile', () => {
    const { result } = renderHook(useGroupHugAnnouncementSetup, { wrapper: NavigationWrapper })
    result.current.goToSettings()
    expect(replaceMock).toHaveBeenCalledWith('transactionBatching')
  })
  it('closes popup', () => {
    const { result } = renderHook(useGroupHugAnnouncementSetup, { wrapper: NavigationWrapper })
    result.current.close()
    expect(goBackMock).toHaveBeenCalled()
  })
})
