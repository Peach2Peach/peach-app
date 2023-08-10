import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, goBackMock, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useConfigStore } from '../../../store/configStore'
import { useGroupHugAnnouncementSetup } from './useGroupHugAnnouncementSetup'

describe('useGroupHugAnnouncementSetup', () => {
  beforeEach(() => {
    useConfigStore.getState().reset()
  })
  it('returns default values', () => {
    const { result } = renderHook(useGroupHugAnnouncementSetup, { wrapper: NavigationWrapper })
    expect(result.current).toEqual({
      goToSettings: expect.any(Function),
      close: expect.any(Function),
    })
    expect(useConfigStore.getState().hasSeenGroupHugAnnouncement).toBeFalsy()
  })
  it('goes to profile', () => {
    const { result } = renderHook(useGroupHugAnnouncementSetup, { wrapper: NavigationWrapper })
    result.current.goToSettings()
    expect(replaceMock).toHaveBeenCalledWith('transactionBatching')
    expect(useConfigStore.getState().hasSeenGroupHugAnnouncement).toBeTruthy()
  })
  it('closes popup', () => {
    const { result } = renderHook(useGroupHugAnnouncementSetup, { wrapper: NavigationWrapper })
    result.current.close()
    expect(goBackMock).toHaveBeenCalled()
    expect(useConfigStore.getState().hasSeenGroupHugAnnouncement).toBeTruthy()
  })
})
