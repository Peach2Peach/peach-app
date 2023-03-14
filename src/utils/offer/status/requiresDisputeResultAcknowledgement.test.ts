import { ok } from 'assert'
import { requiresDisputeResultAcknowledgement } from '.'
import { contract } from '../../../../tests/unit/data/contractData'

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
