import { ok } from 'assert'
import { isEscrowReleased } from '../../../../../src/utils/offer/status'
import { sellOffer } from '../../../data/offerData'

describe('isEscrowReleased', () => {
  it('should check if escrow has been released', () => {
    ok(
      isEscrowReleased({
        ...sellOffer,
        released: true,
      }),
    )
    ok(
      isEscrowReleased({
        ...sellOffer,
        refunded: true,
      }),
    )
    ok(
      isEscrowReleased({
        ...sellOffer,
        txId: 'txId',
      }),
    )
    ok(
      !isEscrowReleased({
        ...sellOffer,
      }),
    )
  })
})
