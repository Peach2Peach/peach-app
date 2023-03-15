import { ok } from 'assert'
import { isPaymentConfirmationRequired } from '.'
import { contract } from '../../../../tests/unit/data/contractData'

describe('isPaymentConfirmationRequired', () => {
  it('should check if payment confirmation is required', () => {
    ok(
      isPaymentConfirmationRequired({
        ...contract,
        paymentMade: new Date(),
        paymentConfirmed: null,
      }),
    )
    ok(
      !isPaymentConfirmationRequired({
        ...contract,
        paymentMade: new Date(),
        paymentConfirmed: new Date(),
      }),
    )
    ok(
      !isPaymentConfirmationRequired({
        ...contract,
        paymentMade: null,
        paymentConfirmed: null,
      }),
    )
  })
})
