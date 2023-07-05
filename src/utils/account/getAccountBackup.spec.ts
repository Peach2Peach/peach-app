import { deepStrictEqual } from 'assert'
import { getAccountBackup } from '.'
import * as accountData from '../../../tests/unit/data/accountData'
import { useSettingsStore, defaultSettings } from '../../store/settingsStore'

describe('getAccountBackup', () => {
  it('generates a partial account for backup purposes', () => {
    const accountBackup = getAccountBackup(accountData.buyer, useSettingsStore.getState().getPureState())
    deepStrictEqual(accountBackup, {
      ...accountData.buyer,
      settings: defaultSettings,
      offers: [],
      contracts: [],
      chats: {},
    })
  })
})
