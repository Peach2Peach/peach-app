import { deepStrictEqual, strictEqual } from 'assert'
import { account, defaultAccount, setAccount } from '../../../../src/utils/account'
import { saveContract } from '../../../../src/utils/contract'
import * as accountData from '../../data/accountData'
import * as contractData from '../../data/contractData'

jest.mock('react-native-fs', () => ({
  readFile: async (): Promise<string> => JSON.stringify(accountData.account1),
  writeFile: async (): Promise<void> => {},
  unlink: async (): Promise<void> => {},
}))

describe('saveContract', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
  })

  it('add a new offer to account', () => {
    saveContract(contractData.contract)
    deepStrictEqual(account.contracts[0], contractData.contract)
  })
  it('update an existing offer on account', () => {
    const now = new Date()
    saveContract({
      ...contractData.contract,
      paymentMade: now,
    })
    strictEqual(account.contracts.length, 1)
    deepStrictEqual(account.contracts[0].paymentMade, now)
  })
})
