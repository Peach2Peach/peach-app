import { act } from 'react-test-renderer'
import { renderHook, waitFor } from 'test-utils'
import { account1 } from '../../../../tests/unit/data/accountData'
import { MSINANHOUR } from '../../../constants'
import { useSettingsStore } from '../../../store/settingsStore'
import { getPeachAccount } from '../../../utils/peachAPI/peachAccount'
import { useRestoreFromFileSetup } from './useRestoreFromFileSetup'

jest.useFakeTimers()

const decryptAccountMock = jest.fn().mockReturnValue([account1])
jest.mock('../../../utils/account/decryptAccount', () => ({
  decryptAccount: (...args: unknown[]) => decryptAccountMock(...args),
}))
const recoverAccountMock = jest.fn().mockResolvedValue(account1)
jest.mock('../../../utils/account/recoverAccount', () => ({
  recoverAccount: (...args: unknown[]) => recoverAccountMock(...args),
}))

const storeAccountMock = jest.fn()
jest.mock('../../../utils/account/storeAccount', () => ({
  storeAccount: (...args: unknown[]) => storeAccountMock(...args),
}))

const apiSuccess = {
  expiry: Date.now() + MSINANHOUR,
  accessToken: 'accessToken',
}
const authMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  peachAPI: jest.requireActual('../../../utils/peachAPI').peachAPI,
  auth: (...args: unknown[]) => authMock(...args),
}))

describe('useRestoreFromFileSetup', () => {
  const encryptedAccount = 'encryptedAccount'
  const password = 'password'
  it('restores account from file', async () => {
    const { result } = renderHook(useRestoreFromFileSetup)
    act(() => {
      result.current.setFile({
        name: '',
        content: encryptedAccount,
      })
      result.current.setPassword(password)
    })
    act(() => {
      result.current.submit()
    })
    await waitFor(() => {
      expect(result.current.restored).toBeTruthy()
    })
    expect(decryptAccountMock).toHaveBeenCalledWith({
      encryptedAccount,
      password,
    })
    expect(recoverAccountMock).toHaveBeenCalledWith(account1)
    expect(storeAccountMock).toHaveBeenCalledWith(account1)
    expect(getPeachAccount()?.privateKey?.toString('hex')).toBe(
      '62233e988e4ca00c3b346b4753c7dc316f6ce39280410072ddab298f36a7fe64',
    )
  })
  it('updates the last file backup date after restoring', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(123456789)
    const { result } = renderHook(useRestoreFromFileSetup)
    act(() => {
      result.current.setFile({
        name: '',
        content: encryptedAccount,
      })
      result.current.setPassword(password)
    })
    act(() => {
      result.current.submit()
    })
    await waitFor(() => {
      expect(result.current.restored).toBeTruthy()
    })
    expect(useSettingsStore.getState()).toEqual(
      expect.objectContaining({
        lastFileBackupDate: Date.now(),
        shouldShowBackupOverlay: false,
        showBackupReminder: false,
      }),
    )
  })
})
