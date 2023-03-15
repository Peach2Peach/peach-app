import { ok } from 'assert'
import { isFunded } from '.'
import { sellOffer } from '../../../../tests/unit/data/offerData'

describe('isFunded', () => {
  it('should check if escrow is funded', () => {
    ok(
      isFunded({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'FUNDED',
        },
      }),
    )
    ok(
      !isFunded({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'MEMPOOL',
        },
      }),
    )
    ok(
      !isFunded({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'NULL',
        },
      }),
    )
    ok(
      !isFunded({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'CANCELED',
        },
      }),
    )
    ok(
      !isFunded({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'WRONG_FUNDING_AMOUNT',
        },
      }),
    )
  })
})
