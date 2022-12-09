import { ok } from 'assert'
import { hasFundingTransactions } from '../../../../../src/utils/offer/status'
import { sellOffer } from '../../../data/offerData'

describe('hasFundingTransactions', () => {
  it('should check if offer has funding transactions', () => {
    ok(
      hasFundingTransactions({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          txIds: ['1'],
        },
      }),
    )
    ok(
      hasFundingTransactions({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          txIds: ['1', '2'],
        },
      }),
    )
    ok(
      !hasFundingTransactions({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          txIds: [],
        },
      }),
    )
  })
})
