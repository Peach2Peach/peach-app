import { deepStrictEqual } from 'assert'
import { sellOffer } from '../../../tests/unit/data/offerData'
import { getEscrowExpiry } from './getEscrowExpiry'

describe('getEscrowExpiry', () => {
  it('should return the offer expiry', () => {
    const now = new Date()
    const expectedExpiry = new Date()
    expectedExpiry.setMilliseconds(+322200000)

    const offerExpiry = getEscrowExpiry({
      ...sellOffer,
      publishingDate: now,
    })

    deepStrictEqual(offerExpiry, {
      date: expectedExpiry,
      ttl: 322200000,
      isExpired: false,
    })
  })
  it('should return the offer expiry and signal that it is expired', () => {
    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(-10)
    const expectedExpiry = new Date(tenDaysAgo)
    expectedExpiry.setMilliseconds(+322200000)

    const offerExpiry = getEscrowExpiry({
      ...sellOffer,
      creationDate: tenDaysAgo,
      publishingDate: tenDaysAgo,
    })

    deepStrictEqual(offerExpiry, {
      date: expectedExpiry,
      ttl: 322200000,
      isExpired: true,
    })
  })
})
