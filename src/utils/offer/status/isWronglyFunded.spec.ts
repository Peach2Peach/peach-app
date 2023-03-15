import { ok } from 'assert'
import { isWronglyFunded } from '.'
import { sellOffer } from '../../../../tests/unit/data/offerData'

describe('isWronglyFunded', () => {
  it('should check offer has been wrongly funded', () => {
    ok(
      isWronglyFunded({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'WRONG_FUNDING_AMOUNT',
        },
      }),
    )
    ok(
      !isWronglyFunded({
        ...sellOffer,
        funding: {
          ...sellOffer.funding,
          status: 'FUNDED',
        },
      }),
    )
  })
})
