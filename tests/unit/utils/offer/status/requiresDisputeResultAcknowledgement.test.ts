import { ok } from 'assert'
import { requiresDisputeResultAcknowledgement } from '../../../../../src/utils/offer/status'
import { contract } from '../../../data/contractData'

describe('requiresDisputeResultAcknowledgement', () => {
  it('should check if dispute result has been acknowledged', () => {
    ok(
      requiresDisputeResultAcknowledgement({
        ...contract,
        disputeWinner: 'buyer',
        disputeResultAcknowledged: false,
      }),
    )
    ok(
      !requiresDisputeResultAcknowledgement({
        ...contract,
        disputeWinner: 'buyer',
        disputeResultAcknowledged: true,
      }),
    )
    ok(
      !requiresDisputeResultAcknowledgement({
        ...contract,
        disputeWinner: undefined,
        disputeResultAcknowledged: false,
      }),
    )
  })
})
