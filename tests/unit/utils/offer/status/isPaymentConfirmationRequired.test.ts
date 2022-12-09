import { ok } from 'assert'
import { isPaymentConfirmationRequired } from '../../../../../src/utils/offer/status'
import { contract } from '../../../data/contractData'
import { sellOffer } from '../../../data/offerData'

describe('isPaymentConfirmationRequired', () => {
  it('should check if payment confirmation is required', () => {
    ok(
      isPaymentConfirmationRequired(sellOffer, {
        ...contract,
        paymentMade: new Date(),
        paymentConfirmed: null,
      }),
    )
    ok(
      !isPaymentConfirmationRequired(sellOffer, {
        ...contract,
        paymentMade: new Date(),
        paymentConfirmed: new Date(),
      }),
    )
    ok(
      !isPaymentConfirmationRequired(sellOffer, {
        ...contract,
        paymentMade: null,
        paymentConfirmed: null,
      }),
    )
  })
})
