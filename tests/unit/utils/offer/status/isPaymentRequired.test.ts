import { ok } from 'assert'
import { isPaymentRequired } from '../../../../../src/utils/offer/status'
import { contract } from '../../../data/contractData'
import { buyOffer } from '../../../data/offerData'

describe('isPaymentRequired', () => {
  it('should check if payment is required', () => {
    ok(
      isPaymentRequired(buyOffer, {
        ...contract,
        paymentMade: null,
      }),
    )
    ok(
      isPaymentRequired(buyOffer, {
        ...contract,
        paymentMade: null,
        kycRequired: true,
        kycConfirmed: true,
      }),
    )
    ok(
      !isPaymentRequired(buyOffer, {
        ...contract,
        paymentMade: null,
        kycRequired: true,
        kycConfirmed: false,
        kycResponseDate: null,
      }),
    )
    ok(
      !isPaymentRequired(buyOffer, {
        ...contract,
        paymentMade: new Date(),
      }),
    )
  })
})
