import { act, renderHook } from 'test-utils'
import { account1 } from '../../../../tests/unit/data/accountData'
import { headerState, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useTemporaryAccount } from '../../../hooks/useTemporaryAccount'
import { useAccountStore } from '../../../utils/account/account'
import { useRestoreReputationSetup } from './useRestoreReputationSetup'

jest.useFakeTimers()
const userUpdateMock = jest.fn()
jest.mock('../../../init/userUpdate', () => ({
  userUpdate: (...args: unknown[]) => userUpdateMock(...args),
}))

const params = { referralCode: 'REFERRALCODE' }
const useRouteMock = jest.fn().mockReturnValue({ params })
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

describe('useRestoreReputationSetup', () => {
  it('should return defaults', () => {
    const { result } = renderHook(useRestoreReputationSetup)
    expect(result.current).toEqual({
      restoreReputation: expect.any(Function),
      isLoading: false,
      isRestored: false,
    })
  })
  it('should set up the header correctly', () => {
    renderHook(useRestoreReputationSetup)
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should not restore reputation if temporary account is not set', async () => {
    const { result } = renderHook(useRestoreReputationSetup)

    await act(result.current.restoreReputation)
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isRestored).toBeFalsy()
  })
  it('should restore reputation by saving temporary account and navigate to home', async () => {
    const { result } = renderHook(useRestoreReputationSetup)
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
    const account = useAccountStore.getState().account
    expect(account).toEqual(account1)

    await act(jest.runAllTimers)
    expect(replaceMock).toHaveBeenCalledWith('buy')
    expect(userUpdateMock).toHaveBeenCalledWith(params.referralCode)
  })
})
