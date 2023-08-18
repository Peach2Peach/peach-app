import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { useConfigStore } from '../store/configStore'
import { useInitialNavigation } from './useInitialNavigation'

const wrapper = NavigationWrapper
describe('useInitialNavigation', () => {
  it('should navigate groupHugAnnouncement if not yet seen', () => {
    renderHook(useInitialNavigation, { wrapper })
    expect(navigateMock).toHaveBeenCalledWith('groupHugAnnouncement')
  })
  it('should not navigate groupHugAnnouncement if has been seen', () => {
    useConfigStore.getState().setHasSeenGroupHugAnnouncement(true)
    renderHook(useInitialNavigation, { wrapper })
    expect(navigateMock).not.toHaveBeenCalledWith('groupHugAnnouncement')
  })
})
