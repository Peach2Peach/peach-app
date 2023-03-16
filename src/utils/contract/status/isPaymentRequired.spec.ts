import { ok } from 'assert'
import { isPaymentRequired } from '.'
import { contract } from '../../../../tests/unit/data/contractData'

describe('isPaymentRequired', () => {
  it('should check if payment is required', () => {
    ok(
      isPaymentRequired({
        ...contract,
        paymentMade: null,
      }),
    )
    ok(
      isPaymentRequired({
        ...contract,
        paymentMade: null,
      }),
    )
    ok(
      !isPaymentRequired({
        ...contract,
        paymentMade: null,
      }),
    )
    ok(
      !isPaymentRequired({
        ...contract,
        paymentMade: new Date(),
      }),
    )
  })
})
