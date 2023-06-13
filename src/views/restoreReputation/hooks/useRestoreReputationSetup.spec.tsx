import { act, renderHook } from '@testing-library/react-native'
import { account1 } from '../../../../tests/unit/data/accountData'
import { headerState, NavigationWrapper, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useTemporaryAccount } from '../../../hooks/useTemporaryAccount'
import { account } from '../../../utils/account'
import { useRestoreReputationSetup } from './useRestoreReputationSetup'

jest.useFakeTimers()

describe('useRestoreReputationSetup', () => {
  it('should return defaults', () => {
    const { result } = renderHook(useRestoreReputationSetup, { wrapper: NavigationWrapper })
    expect(result.current).toEqual({
      restoreReputation: expect.any(Function),
      isLoading: false,
      isRestored: false,
    })
  })
  it('should set up the header correctly', () => {
    renderHook(useRestoreReputationSetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should not restore reputation if temporary account is not set', async () => {
    const { result } = renderHook(useRestoreReputationSetup, { wrapper: NavigationWrapper })

    await act(result.current.restoreReputation)
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isRestored).toBeFalsy()
  })
  it('should restore reputation by saving temporary account and navigate to home', async () => {
    const { result } = renderHook(useRestoreReputationSetup, { wrapper: NavigationWrapper })
    const { result: tempAccount } = renderHook(() => useTemporaryAccount())

    act(() => {
      tempAccount.current.setTemporaryAccount(account1)
    })
    await act(() => {
      result.current.restoreReputation()
      jest.runAllTimers()
    })
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.isRestored).toBeTruthy()
    expect(account).toEqual(account1)

    await act(jest.runAllTimers)
    expect(replaceMock).toHaveBeenCalledWith('home')
  })
})
