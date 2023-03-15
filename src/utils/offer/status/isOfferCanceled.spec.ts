import { ok } from 'assert'
import { isOfferCanceled } from '.'
import { buyOffer, sellOffer } from '../../../../tests/unit/data/offerData'

describe('isOfferCanceled', () => {
  it('should check if offer is canceled', () => {
    ok(
      isOfferCanceled({
        ...buyOffer,
        online: false,
        contractId: undefined,
      }),
    )
    ok(
      !isOfferCanceled({
        ...buyOffer,
        online: true,
        contractId: undefined,
      }),
    )
    ok(
      !isOfferCanceled({
        ...buyOffer,
        online: false,
        contractId: '1-2',
      }),
    )
    ok(
      isOfferCanceled({
        ...sellOffer,
        online: false,
        funding: {
          ...sellOffer.funding,
          status: 'WRONG_FUNDING_AMOUNT',
        },
      }),
    )
    ok(
      isOfferCanceled({
        ...sellOffer,
        online: false,
        funding: {
          ...sellOffer.funding,
          status: 'CANCELED',
        },
      }),
    )
  })
})
