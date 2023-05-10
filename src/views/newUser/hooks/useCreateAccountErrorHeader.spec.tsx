import { NavigationContainer } from '@react-navigation/native'
import { renderHook } from '@testing-library/react-native'
import { useHeaderState } from '../../../components/header/store'
import { useCreateAccountErrorHeader } from './useCreateAccountErrorHeader'

describe('useCreateAccountErrorHeader', () => {
  it('should set up the header correctly', () => {
    renderHook(useCreateAccountErrorHeader, { wrapper: NavigationContainer })

    expect(useHeaderState.getState().title).toBe('welcome to Peach!')
    expect(useHeaderState.getState().hideGoBackButton).toBeTruthy()
  })
})
