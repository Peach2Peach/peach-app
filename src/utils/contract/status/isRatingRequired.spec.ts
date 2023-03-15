import { ok } from 'assert'
import { isRatingRequired } from '.'
import { contract } from '../../../../tests/unit/data/contractData'
import { buyOffer, sellOffer } from '../../../../tests/unit/data/offerData'

describe('isRatingRequired', () => {
  it('should check if rating is required', () => {
    ok(
      isRatingRequired(buyOffer, {
        ...contract,
        canceled: false,
        ratingSeller: 0,
        ratingBuyer: 0,
      }),
    )
    ok(
      isRatingRequired(sellOffer, {
        ...contract,
        canceled: false,
        ratingSeller: 0,
        ratingBuyer: 0,
      }),
    )
    ok(
      !isRatingRequired(buyOffer, {
        ...contract,
        canceled: false,
        ratingSeller: 1,
        ratingBuyer: 0,
      }),
    )
    ok(
      !isRatingRequired(sellOffer, {
        ...contract,
        canceled: false,
        ratingSeller: 0,
        ratingBuyer: 1,
      }),
    )
    ok(
      !isRatingRequired(sellOffer, {
        ...contract,
        canceled: true,
        ratingSeller: 0,
        ratingBuyer: 0,
      }),
    )
  })
})
