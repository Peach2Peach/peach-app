import { NavigationContainer } from '@react-navigation/native'
import { renderHook } from '@testing-library/react-native'
import { useHeaderState } from '../../../components/header/store'
import { useBackupHeader } from './useBackupHeader'

describe('useBackupHeader', () => {
  it('should set up the header correctly', () => {
    renderHook(useBackupHeader, { wrapper: NavigationContainer })

    expect(useHeaderState.getState().title).toBe('restore backup')
  })
})
