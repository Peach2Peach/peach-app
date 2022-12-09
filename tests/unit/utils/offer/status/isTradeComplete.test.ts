import { ok } from 'assert'
import { isTradeComplete } from '../../../../../src/utils/offer/status'
import { contract } from '../../../data/contractData'

describe('isTradeComplete', () => {
  it('should check if trade has been completed', () => {
    ok(
      isTradeComplete({
        ...contract,
        paymentConfirmed: new Date(),
      }),
    )
    ok(
      !isTradeComplete({
        ...contract,
        paymentConfirmed: null,
      }),
    )
  })
})
