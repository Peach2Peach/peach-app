import { deepStrictEqual } from 'assert'
import { getAccountBackup } from '.'
import * as accountData from '../../../tests/unit/data/accountData'
import { defaultSettings, useSettingsStore } from '../../store/settingsStore'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'

describe('getAccountBackup', () => {
  it('generates a partial account for backup purposes', () => {
    const accountBackup = getAccountBackup({
      account: accountData.buyer,
      paymentData: usePaymentDataStore.getState().getPaymentDataArray(),
      settings: useSettingsStore.getState().getPureState(),
    })
    deepStrictEqual(accountBackup, {
      ...accountData.buyer,
      paymentData: [],
      settings: defaultSettings,
      offers: [],
      chats: {},
    })
  })
})
