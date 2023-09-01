import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useConfigStore } from '../../../store/configStore'
import { useGroupHugAnnouncementSetup } from './useGroupHugAnnouncementSetup'

const offerId = '123'
const useRouteMock = jest.fn(() => ({ params: { offerId } }))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))
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
    expect(replaceMock).toHaveBeenCalledWith('offerPublished', { offerId, isSellOffer: false })
    expect(useConfigStore.getState().hasSeenGroupHugAnnouncement).toBeTruthy()
  })
})
