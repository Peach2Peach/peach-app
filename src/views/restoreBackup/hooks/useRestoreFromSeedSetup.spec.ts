import { act, renderHook, waitFor } from 'test-utils'
import { account1 } from '../../../../tests/unit/data/accountData'
import { useSettingsStore } from '../../../store/settingsStore'
import { useRestoreFromSeedSetup } from './useRestoreFromSeedSetup'

jest.useFakeTimers()

const createAccountMock = jest.fn().mockResolvedValue(account1)
jest.mock('../../../utils/account/createAccount', () => ({
  createAccount: (...args: unknown[]) => createAccountMock(...args),
}))
const recoverAccountMock = jest.fn().mockResolvedValue(account1)
jest.mock('../../../utils/account/recoverAccount', () => ({
  recoverAccount: (...args: unknown[]) => recoverAccountMock(...args),
}))

const storeAccountMock = jest.fn()
jest.mock('../../../utils/account/storeAccount', () => ({
  storeAccount: (...args: unknown[]) => storeAccountMock(...args),
}))

describe('useRestoreFromSeedSetup', () => {
  it('restores account from seed', async () => {
    const { result } = renderHook(useRestoreFromSeedSetup)
    act(() => {
      result.current.setWords(account1.mnemonic.split(' '))
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
  it('updates the last seed backup date', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(123456789)
    const { result } = renderHook(useRestoreFromSeedSetup)
    act(() => {
      result.current.setWords(account1.mnemonic.split(' '))
    })
    act(() => {
      result.current.submit()
    })
    await waitFor(() => {
      expect(result.current.restored).toBeTruthy()
    })
    expect(useSettingsStore.getState()).toEqual(
      expect.objectContaining({
        lastSeedBackupDate: Date.now(),
        shouldShowBackupOverlay: false,
        showBackupReminder: false,
      }),
    )
  })
})
