import { deepStrictEqual } from 'assert'
import { getAccountBackup } from '../../../../src/utils/account'
import * as accountData from '../../data/accountData'

describe('getAccountBackup', () => {
  it('generates a partial account for backup purposes', () => {
    const accountBackup = getAccountBackup(accountData.buyer)
    deepStrictEqual(accountBackup, {
      ...accountData.buyer,
      offers: [],
      contracts: [],
      chats: {},
    })
  })
})
