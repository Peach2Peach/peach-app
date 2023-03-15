import { deepStrictEqual } from 'assert'
import { getAccountBackup } from '.'
import * as accountData from '../../../tests/unit/data/accountData'

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
