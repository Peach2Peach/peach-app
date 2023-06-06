import { renderHook } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useBackupHeader } from './useBackupHeader'

describe('useBackupHeader', () => {
  it('should set up the header correctly', () => {
    renderHook(useBackupHeader, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
