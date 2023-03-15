import { ok } from 'assert'
import { isEscrowRefunded } from '.'
import { sellOffer } from '../../../../tests/unit/data/offerData'

describe('isEscrowRefunded', () => {
  it('should check if escrow has been refunded', () => {
    ok(
      isEscrowRefunded({
        ...sellOffer,
        refunded: true,
      }),
    )
    ok(
      !isEscrowRefunded({
        ...sellOffer,
        released: true,
      }),
    )
    ok(
      isEscrowRefunded({
        ...sellOffer,
        txId: 'txId',
      }),
    )
    ok(
      !isEscrowRefunded({
        ...sellOffer,
      }),
    )
  })
})
