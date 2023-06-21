import { renderHook } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useCreateAccountErrorHeader } from './useCreateAccountErrorHeader'

describe('useCreateAccountErrorHeader', () => {
  it('should set up the header correctly', () => {
    renderHook(useCreateAccountErrorHeader, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
