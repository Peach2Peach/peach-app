import { renderHook } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../tests/unit/helpers/NavigationWrapper'
import { useHeaderSetup } from './useHeaderSetup'

describe('useHeaderSetup', () => {
  it('should update the header with the headerConfig', () => {
    renderHook(() => useHeaderSetup({ title: 'test', hideGoBackButton: true, theme: 'default' }), {
      wrapper: NavigationWrapper,
    })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should handle a string as headerConfig', () => {
    renderHook(() => useHeaderSetup('test'), { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
