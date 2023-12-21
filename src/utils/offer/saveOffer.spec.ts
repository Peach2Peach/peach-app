import { deepStrictEqual, strictEqual } from 'assert'
import * as offerData from '../../../tests/unit/data/offerData'
import { defaultAccount, setAccount, useAccountStore } from '../account/account'
import { saveOffer } from './saveOffer'

describe('saveOffer', () => {
  beforeAll(() => {
    setAccount(defaultAccount)
  })

  it('does not save offers without an ID', () => {
    const errorSpy = jest.spyOn(jest.requireMock('../../utils/log'), 'error')
    // @ts-expect-error we specifically want to test for offers wihout an ID
    saveOffer(offerData.buyOfferUnpublished)
    expect(errorSpy).toHaveBeenCalled()
    const account = useAccountStore.getState().account
    expect(account.offers.length).toBe(0)
  })
  it('add a new offer to account', () => {
    saveOffer(offerData.buyOffer)
    saveOffer(offerData.sellOffer)
    const account = useAccountStore.getState().account
    deepStrictEqual(account.offers[0], offerData.buyOffer)
    deepStrictEqual(account.offers[1], offerData.sellOffer)
  })
  it('update an existing offer on account', () => {
    saveOffer({
      ...offerData.buyOffer,
      matches: ['38'],
    })
    const account = useAccountStore.getState().account
    strictEqual(account.offers.length, 2)
    deepStrictEqual(account.offers[0].matches, ['38'])
  })
})
