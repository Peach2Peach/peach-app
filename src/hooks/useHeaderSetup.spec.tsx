import { renderHook } from 'test-utils'
import { headerState } from '../../tests/unit/helpers/NavigationWrapper'
import { useHeaderSetup } from './useHeaderSetup'

describe('useHeaderSetup', () => {
  it('should update the header with the headerConfig', () => {
    renderHook(() => useHeaderSetup({ title: 'test', hideGoBackButton: true, theme: 'default' }))
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should handle a string as headerConfig', () => {
    renderHook(() => useHeaderSetup('test'))
    expect(headerState.header()).toMatchSnapshot()
  })
})
