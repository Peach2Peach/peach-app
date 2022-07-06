import { deepStrictEqual, strictEqual } from 'assert'
import { account, defaultAccount, setAccount } from '../../../src/utils/account'
import { saveOffer } from '../../../src/utils/offer'
import * as accountData from '../data/accountData'

jest.mock('react-native-fs', () => ({
  readFile: async (): Promise<string> => JSON.stringify(accountData.account1),
  writeFile: async (): Promise<void> => {},
  unlink: async (): Promise<void> => {}
}))

describe('saveOffer', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
  })

  it('does not save offers without an ID', () => {
    expect(() => saveOffer(accountData.buyOfferUnpublished)).toThrowError()
  })
  it('add a new offer to account', () => {
    saveOffer(accountData.buyOffer)
    saveOffer(accountData.sellOffer)
    deepStrictEqual(account.offers[0], accountData.buyOffer)
    deepStrictEqual(account.offers[1], accountData.sellOffer)
  })
  it('update an existing offer on account', () => {
    saveOffer({
      ...accountData.buyOffer,
      matches: ['38']
    })
    strictEqual(account.offers.length, 2)
    deepStrictEqual(account.offers[0].matches, ['38'])
  })
})
