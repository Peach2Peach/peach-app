import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { useSignMessageSetup } from './useSignMessageSetup'

describe('useSignMessageSetup', () => {
  it('should set up header correctly', () => {
    renderHook(useSignMessageSetup, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('sign your address')
    expect(useHeaderState.getState().icons?.[0].id).toBe('helpCircle')
  })
})
