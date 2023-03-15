import { deepStrictEqual } from 'assert'
import { getOfferExpiry } from '.'
import * as offerData from '../../../tests/unit/data/offerData'

describe('getOfferExpiry', () => {
  it('should return the offer expiry', async () => {
    const now = new Date()
    const expectedExpiry = new Date()
    expectedExpiry.setMilliseconds(+161100000)

    const offerExpiry = await getOfferExpiry({
      ...offerData.sellOffer,
      publishingDate: now,
    })

    deepStrictEqual(offerExpiry, {
      date: expectedExpiry,
      ttl: 161100000,
      isExpired: false,
    })
  })
  it('should return the offer expiry and signal that it is expired', async () => {
    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(-10)
    const expectedExpiry = new Date(tenDaysAgo)
    expectedExpiry.setMilliseconds(+161100000)

    const offerExpiry = await getOfferExpiry({
      ...offerData.sellOffer,
      creationDate: tenDaysAgo,
      publishingDate: tenDaysAgo,
    })

    deepStrictEqual(offerExpiry, {
      date: expectedExpiry,
      ttl: 161100000,
      isExpired: true,
    })
  })
})
