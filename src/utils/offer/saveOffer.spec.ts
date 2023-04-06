import { deepStrictEqual, strictEqual } from 'assert'
import { account, defaultAccount, setAccount } from '../account'

import { saveOffer } from '.'
import * as offerData from '../../../tests/unit/data/offerData'

describe('saveOffer', () => {
  beforeAll(async () => {
    await setAccount(defaultAccount)
  })

  it('does not save offers without an ID', () => {
    const errorSpy = jest.spyOn(jest.requireMock('../../utils/log'), 'error')
    saveOffer(offerData.buyOfferUnpublished)
    expect(errorSpy).toHaveBeenCalled()
    expect(account.offers.length).toBe(0)
  })
  it('add a new offer to account', () => {
    saveOffer(offerData.buyOffer)
    saveOffer(offerData.sellOffer)
    deepStrictEqual(account.offers[0], offerData.buyOffer)
    deepStrictEqual(account.offers[1], offerData.sellOffer)
  })
  it('update an existing offer on account', () => {
    saveOffer({
      ...offerData.buyOffer,
      matches: ['38'],
    })
    strictEqual(account.offers.length, 2)
    deepStrictEqual(account.offers[0].matches, ['38'])
  })
})
