import { ok } from 'assert'
import { isFundingCanceled } from '.'
import { sellOffer } from '../../../../tests/unit/data/offerData'

describe('isFundingCanceled', () => {
  it('should check if escrow is canceled', () => {
    ok(
      isFundingCanceled({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'CANCELED',
        },
      }),
    )
    ok(
      !isFundingCanceled({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'MEMPOOL',
        },
      }),
    )
    ok(
      !isFundingCanceled({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'NULL',
        },
      }),
    )
    ok(
      !isFundingCanceled({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'FUNDED',
        },
      }),
    )
    ok(
      !isFundingCanceled({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'WRONG_FUNDING_AMOUNT',
        },
      }),
    )
  })
})
