import { ok } from 'assert'
import { isDisputeActive } from '../../../../../src/utils/offer/status'
import { contract } from '../../../data/contractData'

describe('isDisputeActive', () => {
  it('should check if a dispute is active', () => {
    ok(
      isDisputeActive({
        ...contract,
        disputeActive: true,
      }),
    )
    ok(
      !isDisputeActive({
        ...contract,
        disputeActive: false,
      }),
    )
  })
})
