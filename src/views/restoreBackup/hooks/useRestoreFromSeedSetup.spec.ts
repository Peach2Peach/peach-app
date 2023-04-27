import { renderHook, waitFor } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { account1 } from '../../../../tests/unit/data/accountData'
import { MSINANHOUR } from '../../../constants'
import { useRestoreFromSeedSetup } from './useRestoreFromSeedSetup'

jest.useFakeTimers()

const navigationReplaceMock = jest.fn()
const useNavigationMock = jest.fn().mockReturnValue({
  replace: (...args: any[]) => navigationReplaceMock(...args),
})
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => useNavigationMock(),
}))

const createAccountMock = jest.fn().mockResolvedValue(account1)
jest.mock('../../../utils/account/createAccount', () => ({
  createAccount: (...args: any[]) => createAccountMock(...args),
}))
const recoverAccountMock = jest.fn().mockResolvedValue(account1)
jest.mock('../../../utils/account/recoverAccount', () => ({
  recoverAccount: (...args: any[]) => recoverAccountMock(...args),
}))

const storeAccountMock = jest.fn()
jest.mock('../../../utils/account/storeAccount', () => ({
  storeAccount: (...args: any[]) => storeAccountMock(...args),
}))

const apiSuccess = {
  expiry: Date.now() + MSINANHOUR,
  accessToken: 'accessToken',
}
const authMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  auth: (...args: any[]) => authMock(...args),
}))

describe('useRestoreFromSeedSetup', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('restores account from file', async () => {
    const { result } = renderHook(useRestoreFromSeedSetup)
    act(() => {
      result.current.setWords(account1.mnemonic!.split(' '))
    })
    act(() => {
      result.current.submit()
    })
    await waitFor(() => {
      expect(result.current.restored).toBeTruthy()
    })
    expect(createAccountMock).toHaveBeenCalledWith(account1.mnemonic)
    expect(recoverAccountMock).toHaveBeenCalledWith(account1)
    expect(storeAccountMock).toHaveBeenCalledWith(account1)
  })
})
