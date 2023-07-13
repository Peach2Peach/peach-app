import { ok } from 'assert'
import { settingsStorage } from '../../store/settingsStore'
import { deleteAccount, setAccount } from '.'
import { accountStorage } from './accountStorage'
import { chatStorage } from './chatStorage'
import { contractStorage } from './contractStorage'
import { offerStorage } from './offerStorage'
import { deleteAccessToken } from '../peachAPI/accessToken'
import { deletePeachAccount } from '../peachAPI/peachAccount'
import * as accountData from '../../../tests/unit/data/accountData'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'

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
    deleteAccount()

    expect(accountStorage.clearStore).toHaveBeenCalled()
    expect(offerStorage.clearStore).toHaveBeenCalled()
    expect(contractStorage.clearStore).toHaveBeenCalled()
    expect(chatStorage.clearStore).toHaveBeenCalled()
    expect(settingsStorage.clearStore).toHaveBeenCalled()
    expect(usePaymentDataStoreReset).toHaveBeenCalled()
    expect(deleteAccessToken).toHaveBeenCalled()
    expect(deletePeachAccount).toHaveBeenCalled()

    ok(true)
  })
})
