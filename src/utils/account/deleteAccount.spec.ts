import { ok } from 'assert'
import * as accountData from '../../../tests/unit/data/accountData'
import { useSessionStore } from '../../store/sessionStore'
import { settingsStorage } from '../../store/settingsStore'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { deleteAccessToken } from '../peachAPI/accessToken'
import { deletePeachAccount } from '../peachAPI/peachAccount'
import { setAccount } from './account'
import { accountStorage } from './accountStorage'
import { chatStorage } from './chatStorage'
import { deleteAccount } from './deleteAccount'
import { offerStorage } from './offerStorage'

jest.mock('../peachAPI/accessToken', () => ({
  ...jest.requireActual('../peachAPI/accessToken'),
  deleteAccessToken: jest.fn(),
}))
jest.mock('../peachAPI/peachAccount', () => ({
  ...jest.requireActual('../peachAPI/peachAccount'),
  deletePeachAccount: jest.fn(),
}))

describe('deleteAccount', () => {
  beforeAll(() => {
    setAccount(accountData.account1)
  })

  it('would delete account file', () => {
    const usePaymentDataStoreReset = jest.spyOn(usePaymentDataStore.getState(), 'reset')
    const useSessionStoreReset = jest.spyOn(useSessionStore.getState(), 'reset')
    deleteAccount()

    expect(accountStorage.clearStore).toHaveBeenCalled()
    expect(offerStorage.clearStore).toHaveBeenCalled()
    expect(chatStorage.clearStore).toHaveBeenCalled()
    expect(settingsStorage.clearStore).toHaveBeenCalled()
    expect(usePaymentDataStoreReset).toHaveBeenCalled()
    expect(useSessionStoreReset).toHaveBeenCalled()
    expect(deleteAccessToken).toHaveBeenCalled()
    expect(deletePeachAccount).toHaveBeenCalled()

    ok(true)
  })
})
