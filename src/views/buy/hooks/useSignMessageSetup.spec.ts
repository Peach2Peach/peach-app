import { renderHook } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSignMessageSetup } from './useSignMessageSetup'

describe('useSignMessageSetup', () => {
  it('should set up header correctly', () => {
    renderHook(useSignMessageSetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
