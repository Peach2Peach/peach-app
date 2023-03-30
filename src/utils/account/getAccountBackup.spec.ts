import { deepStrictEqual } from 'assert'
import { getAccountBackup } from '.'
import * as accountData from '../../../tests/unit/data/accountData'
import { defaultSettings } from '../../store/defaults'
import { settingsStore } from '../../store/settingsStore'

describe('getAccountBackup', () => {
  it('generates a partial account for backup purposes', () => {
    const accountBackup = getAccountBackup(accountData.buyer, settingsStore.getState().getPureState())
    deepStrictEqual(accountBackup, {
      ...accountData.buyer,
      settings: defaultSettings,
      offers: [],
      contracts: [],
      chats: {},
    })
  })
})
