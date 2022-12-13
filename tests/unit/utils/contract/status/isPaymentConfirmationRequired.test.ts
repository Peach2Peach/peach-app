import { ok } from 'assert'
import { isPaymentConfirmationRequired } from '../../../../../src/utils/contract/status'
import { contract } from '../../../data/contractData'

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
