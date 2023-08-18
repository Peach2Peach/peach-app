import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { useInitialNavigation } from './useInitialNavigation'

const wrapper = NavigationWrapper
describe('useInitialNavigation', () => {
  it('should navigate groupHugAnnouncement if not yet seen', () => {
    renderHook(useInitialNavigation, { wrapper })
    expect(navigateMock).toHaveBeenCalledWith('groupHugAnnouncement')
  })
})
